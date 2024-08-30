# Use the official Node.js image.
FROM node:20

# Set the working directory.
WORKDIR /app

# Install pnpm.
RUN npm install -g pnpm && pnpm install

# Copy package.json and pnpm-lock.yaml.
COPY package.json pnpm-lock.yaml ./


# Copy the rest of the application code.
COPY . .

# Expose the application port.
EXPOSE 3001

# Define the command to run the application.
CMD ["pnpm", "dev"]
