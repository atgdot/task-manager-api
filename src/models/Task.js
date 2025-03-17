const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  createdAt: { type: Date, default: Date.now },
  dueDate: { type: Date },  // Optional deadline
  reminder: { type: Boolean, default: false }, // Enable notification
  category: { type: String, enum: ["work", "personal", "urgent", "study"], default: "personal" },
  comments: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, text: String, createdAt: { type: Date, default: Date.now } }],
  activityLog: [{ message: String, createdAt: { type: Date, default: Date.now } }]
});

module.exports = mongoose.model("Task", TaskSchema);
