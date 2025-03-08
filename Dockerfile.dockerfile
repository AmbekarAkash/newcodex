# Use official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy backend files
COPY server.js . 

# ✅ Copy frontend file (main.html) to the root directory
COPY main.html . 

# Expose the application port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
