// routes/ProtectedGetRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const checkToken = require('../middleware/checkToken');

//AUTH: Token check
router.get("/user/token", checkToken, (req, res) => {
    res.json({
        message: "Token check was succesfull",
        authorizedData: req.user,
    });
});

//AUTH: Route to get all users 
router.get("/user/getall", checkToken, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("_id name email");

    // Check if no users are found
    if (users.length === 0) {
      return res.status(404).send("No User Found");
    }

    // Send the found users
    res.send(users);
  } catch (err) {
    console.error("Error fetching all users:", err); 
    res.status(500).send("Internal Server Error");
  }
});

// router.get("/user/token", checkToken, (req, res) => {
//   //verify the JWT token generated for the user
//   jwt.verify(req.token, "privatekey", (err, authorizedData) => {
//     if (err) {
//       //If error send Forbidden (403)
//       console.log("ERROR: Could not connect to the protected route");
//       res.sendStatus(403);
//     } else {
//       //If token is successfully verified, we can send the autorized data
//       res.json({
//         message: "Successful log in",
//         authorizedData,
//       });
//       console.log("SUCCESS: Connected to protected route");
//     }
//   });
// });

module.exports = router;