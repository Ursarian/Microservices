# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port your app runs on
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
