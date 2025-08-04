const amqp = require('amqplib');
const User = require('../models/user');

const AMQP_URI = process.env.AMQP;

async function startConsumer() {
    const conn = await amqp.connect(AMQP_URI);
    const ch = await conn.createChannel();
}

module.exports = { startConsumer };