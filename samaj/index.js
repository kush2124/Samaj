import express from "express";
import helmet from "helmet";
import connectMongo from "./modules/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import logger from "./modules/logger.js";
import { config } from "@dotenvx/dotenvx";
import adminRouter from "./routes/adminRoutes.js";

config();
const app = express();
const PORT = process.env.PORT ?? 3000;
const mongo = await connectMongo("Samaj");

app.use(helmet());
app.use(express.json());
app.use(userRouter(mongo));
app.use(adminRouter(mongo));
app.use((err, res) => {
  logger.error(err);
});

app.listen(PORT, () => {
  logger.info(`Starting server at port ${PORT}`);
});
