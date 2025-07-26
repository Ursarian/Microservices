# --- Build stage ---
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Install dependencies and build the application
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Run stage ---
FROM nginx:alpine

# Create a non-root group and user
RUN addgroup -S hle37
RUN adduser -S thomas -G hle37

# Create and set ownership of required NGINX folders
RUN mkdir -p /run /var/cache/nginx /var/log/nginx
RUN chown -R thomas:hle37 /run /var/cache/nginx /var/log/nginx

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static files from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Set ownership of static files to non-root user
RUN chown -R thomas:hle37 /usr/share/nginx/html

# Switch to non-root user
USER thomas

# Expose port 80 for HTTP traffic
EXPOSE 80

# Start Nginx server in foreground
CMD ["nginx", "-g", "daemon off;"]