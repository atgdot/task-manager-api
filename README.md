# Task Management API

A simple Task Management API built using Node.js (Express.js), MongoDB, Redis, and Docker.

## 🚀 Features

- User Authentication (JWT-based signup & login)
- Create, Update, Delete, and Retrieve Tasks
- Task Prioritization (Priority Queue)
- Task Comments & Activity Log
- Redis Caching for Faster Task Retrieval
- Unit Testing with Jest & Supertest
- Dockerized Setup for Easy Deployment

## 📦 Installation & Setup

You can run this project in two ways:

1. Using Docker (Recommended) – Runs MongoDB, Redis, and the API in containers.
2. Without Docker (Manual Setup) – Requires MongoDB and Redis installed locally.

### ⚙️ Running with Docker (Recommended)

#### 1️⃣ Clone the Repository

```sh
git clone https://github.com/atgdot/task-manager-api.git
cd task-manager-api
```

#### 2️⃣ Build and Start Containers

```sh
docker-compose up --build
```

#### 3️⃣ Verify Everything is Running

Check running containers:

```sh
docker ps
```

You should see:

```sh
CONTAINER ID   IMAGE          STATUS          PORTS               NAMES
abc12345       task-manager   Up X minutes    0.0.0.0:5000->5000  task-manager-app
def67890       mongo:latest   Up X minutes    0.0.0.0:27017->27017  task-manager-mongo
ghi98765       redis:latest   Up X minutes    0.0.0.0:6379->6379  task-manager-redis
```

#### 4️⃣ API is Ready!

Your API is running at:

```sh
http://localhost:5000
```

#### 5️⃣ Stop Containers (If Needed)

```sh
docker-compose down
```

### ⚙️ Running Without Docker (Manual Setup)

#### 1️⃣ Clone the Repository

```sh
git clone https://github.com/atgdot/task-manager-api.git
cd task-manager-api
```

#### 2️⃣ Install Dependencies

```sh
npm install
```

#### 3️⃣ Set Up Environment Variables

Create a `.env` file in the root directory:

```ini
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_jwt_secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

#### 4️⃣ Start MongoDB & Redis (Locally)

Make sure MongoDB and Redis are running on your machine:

Start MongoDB:
```sh
mongod --dbpath ./data
```

Start Redis:
```sh
redis-server
```

#### 5️⃣ Start the Server

```sh
npm run dev
```

Server will start at:

```sh
http://localhost:5000
```

## 🛠 API Endpoints

### 📝 Authentication

| Method | Endpoint           | Description         |
|--------|---------------------|---------------------|
| POST   | /api/auth/register  | Register a new user |
| POST   | /api/auth/login     | Log in a user       |

### 📝 Tasks

| Method | Endpoint                  | Description                 |
|--------|----------------------------|-----------------------------|
| POST   | /api/tasks                 | Create a task               |
| GET    | /api/tasks                 | Get all tasks (sorted by priority) |
| PUT    | /api/tasks/:id             | Update a task               |
| DELETE | /api/tasks/:id             | Delete a task               |
| POST   | /api/tasks/:id/comment     | Add a comment to a task     |
| GET    | /api/tasks/:id/activity    | Get task activity log       |

## 🧪 Running Tests

### With Docker

```sh
docker-compose exec app npm test
```

### Without Docker

```sh
npm test
```

✅ Runs unit tests using Jest & Supertest.

## 🚀 Deployment

For production, use Docker, Railway, or AWS.

### Run with Docker

```sh
docker build -t task-manager-api .
docker run -p 5000:5000 task-manager-api
```

## 💡 Next Steps

- Implement CI/CD with GitHub Actions
- Deploy to AWS, DigitalOcean, or Railway
- Build a React/Next.js frontend for this API

## 📌 Author

[@atgdot](https://github.com/atgdot)