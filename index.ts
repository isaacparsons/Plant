import logger from "./config/logging";
import app, { server } from "./server/index";

const PORT = process.env.PORT || 3080;
app.listen(PORT, () => {
  server.start();
  logger.info(`Server listening on the port::${PORT}`);
});

export default app;
