import winston from "winston";

const customFormat = winston.format.printf(({ timestamp, level, message, stack }) => {
  const stackInfo = stack ? `\nStack: ${stack}` : ''; 
  return `${timestamp} [${level.toUpperCase()}]: ${message}${stackInfo}`;
});

const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), 
    customFormat 
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "debug.log", level: "debug" }),
  ],
});

export default logger;