# Use the official Node.js image.
FROM node:20

# Set the working directory.
WORKDIR /app

# Install pnpm.
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml.
COPY package.json pnpm-lock.yaml ./

# Install dependencies.
RUN pnpm install

# Copy the rest of the application code.
COPY . .

# Expose the application port.
EXPOSE 3003

# Define the command to run the application.
CMD ["pnpm", "dev"]
