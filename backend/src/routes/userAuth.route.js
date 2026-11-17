import express from "express";
import { register, login, logout } from "../controllers/userAuth.controller.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";

const userAuthRouter = express.Router();

// Register
userAuthRouter.post("/register", register);

// Login
userAuthRouter.post("/login", login);

// Logout
userAuthRouter.post("/logout", validateUser, logout);

// Delete Profile
userAuthRouter.delete("/deleteProfile", validateUser, deleteProfile);

// Check whether user is authenticated or not
userAuthRouter.get("/check", validateUser, (req, res) => {
  const reply = {
    firstName: req.result.firstName,
    emailId: req.result.emailId,
    _id: req.result._id,
  };

  res.status(201).send({
    reply,
    messaeg: "User is Authenticated",
  });
});

// // GetProfile
// authRouter.post("/getProfile", getProfile);

export { userAuthRouter };
