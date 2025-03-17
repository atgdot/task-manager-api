const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getSortedTasks, // ✅ Import getSortedTasks here
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); // ✅ Define router before using it

// Task Routes
router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/sorted", protect, getSortedTasks); // ✅ Now placed after router initialization

module.exports = router;
