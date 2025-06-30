const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

function connectDB() {
    const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.tfj07bt.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;
  try {
    mongoose.connect(url);
  } catch (err) {
    console.error(err.message);
    process.exit(1);  
  }

  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected`);
    // console.log(`Database connected: ${url}`);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: ${err}`);
  });
  return;
} 

module.exports = connectDB();








// async function dropTokenUniqueIndex() {
//   const url = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.tfj07bt.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority&appName=Cluster0`;
//   await mongoose.connect(url); // replace with your URI

//   const userCollection = mongoose.connection.collection("users");

//   try {
//     await userCollection.dropIndex("token_1");
//     console.log("Dropped unique index on token field.");
//   } catch (err) {
//     if (err.codeName === "IndexNotFound") {
//       console.log("Index not found, nothing to drop.");
//     } else {
//       console.error("Error dropping index:", err);
//     }
//   }

//   await mongoose.disconnect();
// }

// dropTokenUniqueIndex();
