import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/";

const connectMongoDB = async () => {
  try {
    const mongodb = await mongoose.connect(MONGODB_URI);
    const dbName = mongodb.connections[0].name;
    console.log(`Connected to Mongo! Database name: "${dbName}"`);
  } catch (error) {
    console.log("Error connecting to mongo: ", error);
  }
};

export default connectMongoDB;
