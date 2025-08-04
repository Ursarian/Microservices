const amqp = require('amqplib');
let channel;

const AMQP_URI = process.env.AMQP;

async function connect() {
    const connection = await amqp.connect(AMQP_URI);
    channel = await connection.createChannel();
    await channel.assertQueue('health-check', { durable: false });
}

function getChannel() {
    if (!channel) throw new Error('AMQP channel not initialized – call connect() first.');
    return channel;
}

module.exports = { connectToRabbit: connect, getChannel };