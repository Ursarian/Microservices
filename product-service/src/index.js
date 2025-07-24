require('dotenv').config();
const connectToDatabase = require('./db');
const app = require('./app');

connectToDatabase()
    .then(() => {
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });