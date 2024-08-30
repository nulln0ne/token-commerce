# Use the official Node.js image.
FROM node:21

# Set the working directory.
WORKDIR /app

# Copy package.json and pnpm-lock.yaml.
COPY package.json pnpm-lock.yaml ./

# Install dependencies using npm and pnpm.
RUN npm install -g pnpm && pnpm install

# Copy the rest of the application code.
COPY . .

# Expose the application port.
EXPOSE 3000

# Define the command to run the application.
CMD ["sh", "-c", "pnpm run typeorm:run-migrations && pnpm start"]
