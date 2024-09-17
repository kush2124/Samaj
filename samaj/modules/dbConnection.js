import mongoose from "mongoose";
import logger from "./logger.js";

const connectMongo = async (dbName) => {
  if (dbName === undefined) {
    throw Error("Database name is required to connect to mongo");
  }

  try {
    await mongoose.connect(`mongodb://127.0.0.1:27017/${dbName}`);
  } catch (ex) {
    logger.error(ex);
  }

  const db = mongoose.connection;

  db.on("error", (err) => {
    logger.error(err);
  });

  db.on("connected", () => {
    logger.info("Connected to mongo db");
  });

  return db;
};

export default connectMongo;
