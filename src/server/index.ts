import cors from "cors";
import express from "express";
import morgan from "morgan";

import { AuthAccess } from "../controllers/auth";
import mainRouter from "./api";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      access: AuthAccess;
    }
  }
}

const runServer = (port: string) => {
  const api = express();

  api.use(cors());

  api.use(morgan("dev"));

  api.use(express.json());
  api.use(express.urlencoded({ extended: false }));

  api.use("/api", mainRouter);

  api.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
    console.log("Press CTRL-C to stop\n");
  });
};

export default runServer;
