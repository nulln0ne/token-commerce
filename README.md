
# 🏦 Token Commerce

Token Commerce is a project that includes both backend and frontend components. The backend is built with NestJS and TypeORM (PostgreSQL), while the frontend uses React and Vite.

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

#### 📊 API Endpoints

The API provides several endpoints to manage users. Below are the supported operations for the `/users` endpoint:

- **Create a User**
  - **Method:** POST
  - **URL:** `/users`
  - **Description:** Creates a new user.
  - **Request Body:**
    ```json
    {
      "walletAddress": "<wallet address>"
    }
    ```
  - **Response:** Returns the created user.
  - **Example:**
    ```bash
    curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d '{"walletAddress": "0x123456789abcdef"}'
    ```

- **Get All Users**
  - **Method:** GET
  - **URL:** `/users`
  - **Description:** Retrieves a list of all users.
  - **Response:** Returns an array of users.
  - **Example:**
    ```bash
    curl -X GET http://localhost:3000/users
    ```

- **Get a User by ID**
  - **Method:** GET
  - **URL:** `/users/:id`
  - **Description:** Retrieves a user by their ID.
  - **Response:** Returns the user with the specified ID.
  - **Example:**
    ```bash
    curl -X GET http://localhost:3000/users/<uuid>
    ```

- **Update a User**
  - **Method:** PUT
  - **URL:** `/users/:id`
  - **Description:** Updates a user's information.
  - **Request Body:**
    ```json
    {
      "walletAddress": "<wallet address> (optional)"
    }
    ```
  - **Response:** Returns the updated user.
  - **Example:**
    ```bash
    curl -X PUT http://localhost:3000/users/<uuid> -H "Content-Type: application/json" -d '{"walletAddress": "0xabcdef123456789"}'
    ```

- **Delete a User**
  - **Method:** DELETE
  - **URL:** `/users/:id`
  - **Description:** Deletes a user by their ID.
  - **Response:** Returns a confirmation of the deletion.
  - **Example:**
    ```bash
    curl -X DELETE http://localhost:3000/users/<uuid>
    ```

### 🌐 Frontend

To run the frontend in a Docker container, use the following command in the root directory of the project:

```bash
docker-compose --profile frontend up
```

The frontend uses [`@web3-onboard`](https://github.com/blocknative/web3-onboard) to connect a wallet.
