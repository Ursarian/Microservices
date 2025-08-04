const amqp = require('amqplib');
let channel;

const AMQP_URI = process.env.AMQP;

async function connect() {
    const connection = await amqp.connect(AMQP_URI);
    channel = await connection.createChannel();
    await channel.assertQueue('user_deleted', { durable: true });
}

async function publishUserDeleted(userData) {
    if (!channel) await connect();

    const payload = {
        ...userData,
        from: process.env.SERVICE_NAME
    };

    channel.sendToQueue(
        'user_deleted',
        Buffer.from(JSON.stringify(payload)),
        { persistent: true });
}

module.exports = { publishUserDeleted };