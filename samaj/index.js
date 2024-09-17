import express from "express";
import connectMongo from "./modules/dbConnection.js";
import userRouter from "./routes/userRoutes.js";
import logger from "./modules/logger.js";
import adminRouter from "./routes/adminRoutes.js";
import helmet from "helmet";

const app = express();
const PORT = 3000;
const mongo = await connectMongo("Samaj");

app.use(helmet());
app.use(express.json());
app.use(userRouter(mongo));
app.use(adminRouter(mongo));
app.use((err, res) => {
  logger.error(err);
  res.status(500).send("Internal failure!");
});

app.listen(PORT, () => {
  logger.info(`Starting server at port ${PORT}`);
});
