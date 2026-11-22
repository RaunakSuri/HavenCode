import express from "express";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import { aiChat } from "../controllers/ai.controller.js";

const aiRouter = express.Router();

aiRouter.post("/chat", validateUser, aiChat);

export { aiRouter };
