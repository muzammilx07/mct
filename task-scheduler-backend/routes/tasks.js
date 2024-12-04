const express = require("express");
const cron = require("node-cron");
const Task = require("../models/Task");
const Log = require("../models/Log");
const sendEmail = require("../config/email");

const router = express.Router();

router.post("/", async (req, res) => {
  const { displayName, schedule, email, message } = req.body;

  if (!displayName || !schedule || !email || !message) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const task = new Task({
      displayName,
      schedule,
      email,
      message,
      successCount: 0,
      errorCount: 0,
      retries: 0,
      status: "pending",
    });
    await task.save();

    cron.schedule(schedule, async () => {
      try {
        await sendEmail(email, `Task: ${displayName}`, message);

        task.successCount++;
        task.lastSuccess = new Date();
        task.status = "completed"; 
        task.retries = 0; 
        await task.save();

        await Log.create({
          taskId: task._id,
          status: "success",
          message: "Email sent successfully",
        });
      } catch (err) {
        
        task.errorCount++;
        task.lastError = err.message;
        task.status = "failed"; 
        task.retries++;
        await task.save();

        await Log.create({
          taskId: task._id,
          status: "error",
          message: err.message,
        });
      }
    });

    res.status(201).json({ message: "Task created and scheduled", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create task", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); 
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task); 
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch task", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete task", error: err.message });
  }
});

module.exports = router;
