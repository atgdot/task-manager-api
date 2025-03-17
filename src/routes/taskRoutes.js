const express = require("express");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  addComment, // 
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router(); 

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.post("/:id/comment", protect, addComment); 

module.exports = router;
