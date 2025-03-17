const cron = require("node-cron");
const Task = require("../models/Task");

cron.schedule("0 9 * * *", async () => {
  console.log("Running scheduled task check at 9 AM...");

  try {
    const overdueTasks = await Task.find({ 
      status: "pending", 
      dueDate: { $lte: new Date() } 
    });

    if (overdueTasks.length > 0) {
      overdueTasks.forEach(task => {
        console.log(`Reminder: Task "${task.title}" is overdue!`);
      });
    } else {
      console.log("No overdue tasks.");
    }
  } catch (error) {
    console.error("Error running task scheduler:", error);
  }
});

console.log("Cron job initialized...");
