const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = express.Router();
const app = express();
const connectDB = require("../DbConfig.js");

const User = require("../models/User");


//Routes
const getRoutes = require("../routes/GetRoutes.js");
const postRoutes = require("../routes/PostRoutes.js");

connectDB;
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

//Routes and controllers
app.use("/getprojects", getRoutes); 
app.use("/postprojects", postRoutes);


// Test
app.get("/", (_req, res) => {
  res.send("<h1>Dont mind me, just checking in :)</h1>");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});