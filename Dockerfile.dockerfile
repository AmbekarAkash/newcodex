# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY server.js . 

# Create public directory and copy frontend files
RUN mkdir -p public
COPY public/ public/

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
