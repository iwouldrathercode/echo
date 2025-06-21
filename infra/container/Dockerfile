# Use Node.js 18 Alpine as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files from backend directory
COPY ../backend/package*.json ./
COPY ../backend/package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code from backend directory
COPY ../backend/ .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3333

# Start the application
CMD ["npm", "start"]