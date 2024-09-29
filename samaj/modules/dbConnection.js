import mongoose from "mongoose";
import logger from "./logger.js";
import { getSecret } from "./awsModule.js";

const connectMongo = async (dbName) => {
  const secret = await getSecret("samaj/db");
  const connectString = `mongodb+srv://${secret.user}:${secret.pass}@samaj-bglore-9fab71c4.mongo.ondigitalocean.com/${dbName}?tls=true&authSource=admin&replicaSet=samaj-bglore`;
  if (dbName === undefined) {
    throw Error("Database name is required to connect to mongo");
  }

  try {
    await mongoose.connect(connectString);
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
