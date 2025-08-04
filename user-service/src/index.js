require('dotenv').config();
const connectToDatabase = require('./db');
const { connectToRabbit } = require('./utils/eventPublisher');
const { startConsumer } = require('./utils/eventConsumer');
const app = require('./app');

Promise.all([
    connectToDatabase(),
    connectToRabbit(),
])
    .then(async () => {
        try {
            await startConsumer();
        } catch (err) {
            console.error('Failed to connect to RabbitMQ:', err);
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });