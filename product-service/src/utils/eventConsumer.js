const amqp = require('amqplib');
const Product = require('../models/product');

const AMQP_URI = process.env.AMQP;

async function startConsumer() {
    const conn = await amqp.connect(AMQP_URI);
    const ch = await conn.createChannel();

    await ch.assertQueue('user_created');

    ch.consume('user_created', msg => {
        const data = JSON.parse(msg.content.toString());
        console.log('New user created:', data);

        // Example: Log, store in cache, update analytics
        ch.ack(msg);
    });

    await ch.assertQueue('user_deleted', { durable: true });

    ch.consume('user_deleted', async msg => {
        const user = JSON.parse(msg.content.toString());
        console.log('Deleting all products for user:', user.id);

        const result = await Product.deleteMany({ ownerId: user.id });
        console.log(`Deleted ${result.deletedCount} products for user ${user.id}`);

        ch.ack(msg);
    });
}

module.exports = { startConsumer };