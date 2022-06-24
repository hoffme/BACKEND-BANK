import config from "./config";
import Controller from "./controllers/controller";
import buildInfrastructure from "./infrastructure/build";
import runServer from "./server";

const runApp = async () => {
  Controller.adapters = await buildInfrastructure();
  runServer(config.port);
};

export default runApp;
