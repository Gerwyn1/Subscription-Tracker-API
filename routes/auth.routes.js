import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signup);
authRouter.post("/sign-in", signin);
authRouter.post("/sign-out", () => {});

export default authRouter;
