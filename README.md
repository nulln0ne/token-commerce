
# 🏦 Token Commerce

Token Commerce is a project that includes both backend and frontend components. The backend is built with NestJS, TypeORM (PostgreSQL), and Redis, while the frontend uses React and Vite.

## 🏁 Getting Started

### Environment Setup

#### Example `.env` content for `backend/src/.env`:

```bash
POSTGRES_USER=<pg_user>
POSTGRES_PASSWORD=<pg_password>
POSTGRES_DB=<pg_db>
POSTGRES_HOST=<pg_host>
POSTGRES_PORT=<pg_port>

REDIS_URL=redis://<redis_host>:<redis_port>

JWT_ACCESS_SECRET=<jwt_access_key>
JWT_ACCESS_EXPIRATION_TIME=3600
JWT_REFRESH_SECRET=<jwt_refresh_key>
JWT_REFRESH_EXPIRATION_TIME=86400
```

#### Example `.env` content for `token-commerce/.env`:

This file should include any additional environment variables required for the frontend or Docker setup.

### 🛠️ Backend

To run the backend, navigate to the `backend` directory and use the following commands:

```bash
pnpm install
pnpm typeorm:run-migrations
pnpm run start:dev
```

The backend will start on [http://localhost:3000](http://localhost:3000).

#### 📊 API Documentation

The API documentation is available via Swagger at [http://localhost:3000/api](http://localhost:3000/api). This documentation provides detailed information on all available endpoints, including request formats, parameters, and responses.

### 🌐 Frontend

To run the frontend, navigate to the `frontend` directory and use the following commands:

```bash
npm install
npm run dev
```

The frontend will be accessible on [http://localhost:5173](http://localhost:5173).

The frontend uses [`@web3-onboard`](https://github.com/blocknative/web3-onboard) to connect a wallet, enabling users to interact with blockchain features directly from the application.

### Additional Information

- The backend application is built using a modular architecture in NestJS, with distinct modules for handling authentication (`auth`), user management (`user`), and configuration management (`config`).
- The backend relies on Redis for session and token management, as well as TypeORM for database interactions with PostgreSQL.
- The frontend is a modern React application set up with Vite for fast development and optimized builds.

### ⚙️ Configuration

Ensure that the database (PostgreSQL) and Redis are correctly set up and accessible using the environment variables specified in your `.env` files.

For Redis, the URL should follow the format:

```bash
REDIS_URL=redis://<redis_host>:<redis_port>
```

For JWT configurations, make sure to define both the access and refresh token secrets and their respective expiration times.

### 🚀 Deployment

For deployment, ensure that all environment variables are correctly set up on your production environment.