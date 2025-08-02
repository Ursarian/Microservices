require('dotenv').config();
const connectToDatabase = require('./db');
const app = require('./app');
const { startConsumer } = require('./utils/eventConsumer');

connectToDatabase()
    .then(async () => {
        try {
            await startConsumer(); // now handled
        } catch (err) {
            console.error('Failed to connect to RabbitMQ:', err);
            process.exit(1); // or skip if optional
        }

        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });