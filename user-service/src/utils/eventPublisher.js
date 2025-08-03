const amqp = require('amqplib');
let channel;

const AMQP_URI = process.env.AMQP;

async function connect() {
    const connection = await amqp.connect(AMQP_URI);
    channel = await connection.createChannel();
    await channel.assertQueue('user_created', { durable: true });
    await channel.assertQueue('user_deleted', { durable: true });
}

async function publishUserCreated(userData) {
    if (!channel) await connect();
    channel.sendToQueue('user_created', Buffer.from(JSON.stringify(userData)), { persistent: true });
}

async function publishUserDeleted(userData) {
    if (!channel) await connect();
    channel.sendToQueue('user_deleted', Buffer.from(JSON.stringify(userData)), { persistent: true });
}

module.exports = { publishUserCreated, publishUserDeleted };