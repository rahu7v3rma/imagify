# Use the official Node.js runtime as base image (Debian-based)
FROM node:22

# Set the working directory inside the container
WORKDIR /app

# Install dependencies
RUN apt-get update && apt-get install pngquant jpegoptim webp imagemagick tesseract-ocr -y

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]