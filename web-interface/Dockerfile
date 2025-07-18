# Base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Accept build arguments
ARG REACT_APP_USER_SERVICE
ARG REACT_APP_PRODUCT_SERVICE

# Define them as environment variables for the build process
ENV REACT_APP_USER_SERVICE=${REACT_APP_USER_SERVICE}
ENV REACT_APP_PRODUCT_SERVICE=${REACT_APP_PRODUCT_SERVICE}

# Copy and install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code and build it
COPY . .
RUN REACT_APP_USER_SERVICE=${REACT_APP_USER_SERVICE} \
    REACT_APP_PRODUCT_SERVICE=${REACT_APP_PRODUCT_SERVICE} \
    npm run build

# Serve the built static files using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]