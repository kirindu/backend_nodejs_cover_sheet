const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN);
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    throw new Error("Error connecting to MongoDB");
  }
};

module.exports = {
  dbConnection,
};
