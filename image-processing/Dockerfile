# Use the official Node.js runtime as the base image
FROM node:18

# Update package repository and install system dependencies
RUN apt update && apt install -y imagemagick optipng jpegoptim webp

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["npm", "start"]