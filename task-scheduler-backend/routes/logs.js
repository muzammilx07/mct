// routes/logs.js
const express = require("express");
const Log = require("../models/Log");

const router = express.Router();

router.get("/task/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;

    const logExists = await Log.exists({ taskId });
    if (!logExists) {
      return res.status(200).json([]); 
    }

    const logs = await Log.find({ taskId });
    res.status(200).json(logs);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
