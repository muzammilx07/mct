const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  }, 
  status: {
    type: String,
    enum: ["success", "error"],
    required: true,
  }, 
  message: {
    type: String,
    required: true,
  }, 
  createdAt: {
    type: Date,
    default: Date.now,
  }, 
});


logSchema.index({ taskId: 1, createdAt: -1 });

module.exports = mongoose.model("Log", logSchema);
