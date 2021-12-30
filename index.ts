import logger from "./config/logging";
import server from "./server/index";

const PORT = process.env.PORT || 3080;
server.listen(PORT, () => {
  logger.info(`Server listening on the port::${PORT}`);
});

export default server;
