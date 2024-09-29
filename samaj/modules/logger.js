import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new DailyRotateFile({
      filename: "logs/error-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxFiles: "30d",
    }),
    new DailyRotateFile({
      filename: "logs/debug-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      level: "debug",
      maxFiles: "30d",
    }),
  ],
});

export default logger;
