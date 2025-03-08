# Use official Node.js as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend files
COPY server.js . 

# Create a folder for the frontend
RUN mkdir public

# Copy frontend files into the public directory
COPY main.html public/

# Expose the port the app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
