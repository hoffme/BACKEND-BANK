import { Router } from "express";

import AccountController from "../controllers/account";
import AuthController, { AuthMiddleware } from "../controllers/auth";
import CardController from "../controllers/card";
import ContactsController from "../controllers/contacts";
import TransferController from "../controllers/transfer";

// AUTH ROUTER
const authRouter = Router();
authRouter.post("/sign_in", (...p) => AuthController.signIn(...p));
authRouter.post("/sign_up", (...p) => AuthController.signUp(...p));

// ACCOUNT ROUTER
const accountRouter = Router();
accountRouter.use((...p) => AuthMiddleware.access(...p));
accountRouter.get("/profile", (...p) => AccountController.profile(...p));
accountRouter.get("/home", (...p) => AccountController.home(...p));

// CARD ROUTER
const cardRouter = Router();
cardRouter.use((...p) => AuthMiddleware.access(...p));
cardRouter.get("/:id", (...p) => CardController.get(...p));
cardRouter.post("/search", (...p) => CardController.search(...p));
cardRouter.post("/", (...p) => CardController.create(...p));

// TRANSFER ROUTER
const transferRouter = Router();
transferRouter.use((...p) => AuthMiddleware.access(...p));
transferRouter.get("/:id", (...p) => TransferController.get(...p));
transferRouter.post("/search", (...p) => TransferController.search(...p));
transferRouter.post("/", (...p) => TransferController.create(...p));

// CONTACTS ROUTER
const contactsRouter = Router();
contactsRouter.use((...p) => AuthMiddleware.access(...p));
contactsRouter.post("/search", (...p) => ContactsController.search(...p));

// MAIN ROUTER
const mainRouter = Router();
mainRouter.use("/auth", authRouter);
mainRouter.use("/account", accountRouter);
mainRouter.use("/card", cardRouter);
mainRouter.use("/transfer", transferRouter);
mainRouter.use("/contacts", contactsRouter);

export default mainRouter;
