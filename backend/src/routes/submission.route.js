import express from "express";
import { validateUser } from "../middlewares/validateUser.middleware.js";
import {
  submitCode,
  runCode,
  getAllUserSubmissions,
} from "../controllers/submission.controller.js";
const submissionRouter = express.Router();

submissionRouter.get("/mySubmissions", validateUser, getAllUserSubmissions);
submissionRouter.post("/submit/:id", validateUser, submitCode);
submissionRouter.post("/run/:id", validateUser, runCode);

export { submissionRouter };
