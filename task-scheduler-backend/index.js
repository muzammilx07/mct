// index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/tasks");
const logRoutes = require("./routes/logs");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB ", err);
    process.exit(1); 
  });

app.use(cors());
app.use(express.json()); 

app.use("/tasks", taskRoutes); 
app.use("/logs", logRoutes); 

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
