const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const express = require("express");
const app = express();

const connectDB = require("../DbConfig.js");

const User = require("../models/User");

connectDB;
dotenv.config();

//More middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//Routes
const getRoutes = require("../routes/GetRoutes.js");
const postRoutes = require("../routes/PostRoutes.js");

const protectedGetRoutes = require("../routes/ProtectedGetRoutes.js");
const protectedPostRoutes = require("../routes/ProtectedPostRoutes.js");
const protectedPatchRoutes = require("../routes/ProtectedPatchRoutes.js");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);

//Routes and controllers
app.use("/getroutes", getRoutes); 
app.use("/postroutes", postRoutes);

app.use("/api/get", protectedGetRoutes);
app.use("/api/post", protectedPostRoutes);
app.use("/api/patch", protectedPatchRoutes);


// Test 
app.get("/", (_req, res) => {
  res.send("<h1>Dont mind me, just checking in :)</h1>");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});