require('dotenv').config();
const connectToDatabase = require('./db');
const { connectToRabbit } = require('./utils/eventPublisher');
const { startConsumer } = require('./utils/eventConsumer');
const retry = require('./utils/retry');
const app = require('./app');

Promise.all([
    retry(connectToDatabase, { retries: 20, delay: 3000 }),
    retry(connectToRabbit, { retries: 20, delay: 3000 }),
])
    .then(async () => {
        try {
            await startConsumer();
        } catch (err) {
            console.error('Failed to connect to RabbitMQ:', err);
        }

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });