const mongoose = require("mongoose");
const cronParser = require("cron-parser");

const TaskSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  }, 

  schedule: {
    type: String,
    required: true,
  }, 

  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  }, 

  message: {
    type: String,
    required: true,
  },

  successCount: {
    type: Number,
    default: 0,
  },

  errorCount: {
    type: Number,
    default: 0,
  },

  lastSuccess: {
    type: Date,
    default: null,
  },

  lastError: {
    type: String,
    default: null,
  },

  disabled: {
    type: Boolean,
    default: false,
  }, 

  retries: {
    type: Number,
    default: 0,
  }, // Retry attempts

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  }, 
  nextRun: {
    type: Date,
    default: null,
  },
});

TaskSchema.index({ status: 1, nextRun: 1 });

TaskSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("schedule")) {
    try {
      const interval = cronParser.parseExpression(this.schedule);
      this.nextRun = interval.next().toDate();
    } catch (err) {
      console.error("Invalid cron expression:", err);
    }
  }
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
