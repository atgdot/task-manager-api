const Task = require("../models/Task");
const redisClient = require("../config/redis");
const PriorityQueue = require("../utils/priorityQueue");

// ✅ Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, reminder, category } = req.body;
    if (!title || !priority) return res.status(400).json({ message: "Title and priority are required" });

    const task = await Task.create({
      user: req.user.id,
      title,
      description,
      priority,
      dueDate,
      reminder,
      category,
    });

    // Log activity
    task.activityLog.push({ message: "Task created" });
    await task.save();

    await redisClient.del(`tasks:${req.user.id}`); // Clear cache
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get All Tasks (with Pagination, Filters & Caching)
exports.getTasks = async (req, res) => {
  try {
    const { priority, status, category, page = 1, limit = 10 } = req.query;
    const query = { user: req.user.id };

    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (category) query.category = category;

    const cacheKey = `tasks:${req.user.id}:${priority || "all"}:${status || "all"}:${category || "all"}:${page}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) return res.json(JSON.parse(cachedData));

    // 🔹 Fetch tasks without sorting
    const tasks = await Task.find(query);

    // 🔹 Use Priority Queue for sorting
    const pq = new PriorityQueue();
    tasks.forEach((task) => pq.enqueue(task));

    const sortedTasks = pq.getAllTasks().slice((page - 1) * limit, page * limit); // Apply pagination after sorting

    await redisClient.setEx(cacheKey, 3600, JSON.stringify(sortedTasks)); // Cache for 1 hour

    res.json(sortedTasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    // Update fields dynamically
    Object.keys(req.body).forEach((key) => (task[key] = req.body[key]));

    // Log activity
    task.activityLog.push({ message: `Task updated: ${Object.keys(req.body).join(", ")}` });

    await task.save();

    await redisClient.del(`tasks:${req.user.id}`); // Clear cache
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Delete Task
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

// ✅ Add Comment to Task
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment cannot be empty" });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ user: req.user.id, text, createdAt: new Date() });

    // Log activity
    task.activityLog.push({ message: "Comment added" });

    await task.save();
    res.json({ message: "Comment added", comments: task.comments });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ✅ Get Task Activity Log
exports.getActivityLog = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ activityLog: task.activityLog });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
