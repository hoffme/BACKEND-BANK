import runServer from "./server";
import buildApp from "./app";

const app = buildApp();
runServer(app);
