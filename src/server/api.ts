import { Router } from "express";

import AccountController from "../controllers/account";
import AuthController, { AuthMiddleware } from "../controllers/auth";
import CardController from "../controllers/card";
import ContactsController from "../controllers/contacts";
import TransferController from "../controllers/transfer";

// AUTH ROUTER
const authRouter = Router();
authRouter.post("/sign_in", AuthController.signInHandler);
authRouter.post("/sign_up", AuthController.signUpHandler);

// ACCOUNT ROUTER
const accountRouter = Router();
accountRouter.use(AuthMiddleware.access);
accountRouter.get("/profile", AccountController.profileHandler);
accountRouter.get("/home", AccountController.homeHandler);

// CARD ROUTER
const cardRouter = Router();
cardRouter.use(AuthMiddleware.access);
cardRouter.get("/:id", CardController.getHandler);
cardRouter.post("/search", CardController.searchHandler);
cardRouter.post("/", CardController.createHandler);
cardRouter.delete("/:id", CardController.removeHandler);

// TRANSFER ROUTER
const transferRouter = Router();
transferRouter.use(AuthMiddleware.access);
transferRouter.get("/:id", TransferController.getHandler);
transferRouter.post("/search", TransferController.searchHandler);
transferRouter.post("/", TransferController.createHandler);

// CONTACTS ROUTER
const contactsRouter = Router();
contactsRouter.use(AuthMiddleware.access);
contactsRouter.post("/search", ContactsController.searchHandler);

// MAIN ROUTER
const mainRouter = Router();
mainRouter.use("/auth", authRouter);
mainRouter.use("/account", accountRouter);
mainRouter.use("/card", cardRouter);
mainRouter.use("/transfer", transferRouter);
mainRouter.use("/contacts", contactsRouter);

export default mainRouter;
