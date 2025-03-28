import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send({ body: "Welcome to the subscription Tracker API!" });
});

app.listen(3000, () => {
  console.log("Subscription Tracker API is running on port 3000");
});

