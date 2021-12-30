import { createLogger, format, transports } from "winston";
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  level: "info",
  format: combine(timestamp(), prettyPrint()),
  transports: [
    // Write all logs with level `error` and below to `error.log`
    new transports.File({ filename: "logfile.log" }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}
export default logger;
