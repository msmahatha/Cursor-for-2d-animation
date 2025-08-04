# Use an official Node.js image
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Install system dependencies needed by Manim and others
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    build-essential \
    ffmpeg \
    texlive-full \
    libcairo2-dev \
    libpango1.0-dev \
    libgdk-pixbuf2.0-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and install Manim
RUN pip3 install --upgrade pip && pip3 install manim

# Copy Node.js dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5001

# Start the Node.js server
CMD ["node", "index.js"]
