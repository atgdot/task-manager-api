const Task = require("../models/Task");
const redisClient = require("../config/redis");
const PriorityQueue = require("../utils/priorityQueue");

// **Create Task**
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !priority) return res.status(400).json({ message: "Title and priority are required" });

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
    });

    await redisClient.del(`tasks:${req.user.id}`); // Clear cache
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// **Get All Tasks (with Pagination & Filtering)**
exports.getTasks = async (req, res) => {
  try {
    const { priority, status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (priority) query.priority = priority;
    if (status) query.status = status;

    // Check cache
    const cacheKey = `tasks:${req.user.id}:${priority || "all"}:${status || "all"}:${page}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));

    const tasks = await Task.find(query)
      .sort({ priority: -1, createdAt: 1 }) // Sort by priority & creation time
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks)); // Cache result for 1 hour
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// **Update Task**
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });

    await redisClient.del(`tasks:${req.user.id}`); // Clear cache
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// **Delete Task**
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    await task.deleteOne();
    await redisClient.del(`tasks:${req.user.id}`); // Clear cache

    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};


exports.getSortedTasks = async (req, res) => {
    try {
      const cacheKey = `sortedTasks:${req.user.id}`;
      const cachedData = await redisClient.get(cacheKey);
  
      if (cachedData) return res.json(JSON.parse(cachedData));
  
      const tasks = await Task.find({ user: req.user.id });
  
      const pq = new PriorityQueue();
      tasks.forEach((task) => pq.enqueue(task));
  
      const sortedTasks = pq.getAllTasks();
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(sortedTasks));
  
      res.json(sortedTasks);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };