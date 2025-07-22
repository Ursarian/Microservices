# --- Build stage ---
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies and build the application
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Run stage ---
# Serve the built static files using Nginx
FROM nginx:alpine
# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy static build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]