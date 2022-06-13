import { Application } from "express";

import config from "./config";

// Start Express server.
const runServer = (app: Application) => {
  const port = config.port;
  const env = config.env;

  app.listen(port, () => {
    console.log(`Running at http://localhost:${port} in ${env} mode`);
    console.log("Press CTRL-C to stop\n");
  });
};

export default runServer;
