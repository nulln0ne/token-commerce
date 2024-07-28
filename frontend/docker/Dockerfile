FROM node:22
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
COPY . .
ENV PORT=3001
ENV NODE_ENV=production
EXPOSE 3001
CMD ["pnpm", "run", "dev"]
