# Use an official Node.js runtime as a parent image
FROM node:18-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Install system dependencies needed for Python, Manim, and FFMPEG
# NEW: Added pkg-config and libcairo2-dev for pycairo dependency
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    texlive-full \
    pkg-config \
    libcairo2-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Manim using pip, adding the --break-system-packages flag to both commands
RUN pip3 install --upgrade pip --break-system-packages && pip3 install manim --break-system-packages

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js app dependencies
RUN npm install

# Bundle app source
COPY . .

# Your app binds to port 5001
EXPOSE 5001

# Define the command to run your app
CMD [ "node", "index.js" ]
