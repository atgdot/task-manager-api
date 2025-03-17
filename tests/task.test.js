const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../src/app");
const Task = require("../src/models/Task");
const User = require("../src/models/User");
const redisClient = require("../src/config/redis");
const cron = require("node-cron");

let mongoServer;
let authToken;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);

  const userResponse = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  authToken = userResponse.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();

  await redisClient.quit();

  cron.getTasks().forEach((task) => task.stop());
});

describe("Task API Tests", () => {
  let taskId;

  it("should create a new task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: "Test Task",
        description: "This is a test task",
        priority: "high",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    taskId = res.body._id;
  });

  it("should retrieve all tasks", async () => {
    const res = await request(app)
      .get("/api/tasks")
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({ status: "completed" });

    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe("completed");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Task deleted");
  });
});
