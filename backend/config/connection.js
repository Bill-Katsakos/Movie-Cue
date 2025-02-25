// Import mongoose for MongoDB connection
const mongoose = require("mongoose");

// Retrieve MongoDB URI from environment variables
const uri = process.env.MONGODB_URI;

// Connect to MongoDB database
main()
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log(err));

// Async function to establish database connection
async function main() {
  await mongoose.connect(uri);
}

// Export the connection function
module.exports = main;

// 🦖
