# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Create a non-root group and user
RUN addgroup -S hle37
RUN adduser -S thomas -G hle37

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app code and set ownership to non-root user
COPY . .
RUN chown -R thomas:hle37 /app

# Switch to non-root user
USER thomas

# Expose the port of the application
EXPOSE 3000

# Start the server
CMD ["npm", "start"]