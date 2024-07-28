
# 🏦 Token Commerce

Token Commerce is a project that includes both backend and frontend components. The backend is built with NestJS, TypeORM (PostgreSQL), and Redis, while the frontend uses React and Vite.

## 🏁 Getting Started

### 🔗 Running both frontend and backend

To run both the backend and frontend together in Docker containers, use the following command in the root directory of the project:

```bash
docker-compose --profile full up
```

### 🛠️ Backend

To run the backend in a Docker container, use the following command in the root directory of the project:

```bash
docker-compose --profile backend up
```

#### 📊 API Documentation

The API documentation is available via Swagger at [http://localhost:3000/api](http://localhost:3000/api). This provides detailed information on all available endpoints, including their request formats, parameters, and responses.

### 🌐 Frontend

To run the frontend in a Docker container, use the following command in the root directory of the project:

```bash
docker-compose --profile frontend up
```

The frontend uses [`@web3-onboard`](https://github.com/blocknative/web3-onboard) to connect a wallet.

