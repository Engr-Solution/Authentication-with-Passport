const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const _connectDB = await mongoose.connect(process.env.DB, {
      useNewUrlparser: true,
    });
    console.log(`Server connected to database ${_connectDB.connection.host}`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = connectDB;
