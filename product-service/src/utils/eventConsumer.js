const amqp = require('amqplib');
const Product = require('../models/product');

const AMQP_URI = process.env.AMQP;

async function startConsumer() {
    const conn = await amqp.connect(AMQP_URI);
    const ch = await conn.createChannel();

    await ch.assertQueue('user_deleted', { durable: true });

    ch.consume('user_deleted', async msg => {
        try {
            const payload = JSON.parse(msg.content.toString());

            if (payload.from !== 'user-service') {
                console.warn('Rejected message from unknown sender:', payload.from);
                return ch.nack(msg, false, false); // reject and do not requeue
            }

            console.log('Deleting all products for user:', payload.id);

            const result = await Product.deleteMany({ ownerId: payload.id });

            console.log(`Deleted ${result.deletedCount} products for user ${payload.id}`);
            ch.ack(msg);
        } catch (err) {
            console.error('Error processing user_deleted event:', err);
            ch.nack(msg, false, false); // reject and discard the message
        }
    });
}

module.exports = { startConsumer };