import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getSubscriptions,
  getUserSubscriptions,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals,
  getSubscription,
  updateSubscription,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getSubscriptions);

subscriptionRouter.get("/:id", getSubscription);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", updateSubscription);

subscriptionRouter.delete("/:id", deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", cancelSubscription);

subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewals);

export default subscriptionRouter;
