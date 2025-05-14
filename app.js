import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
dotenv.config();
const PORT = process.env.PORT || 3000;

// Importing the URL routes
import urlRoutes from "./routes/urlRoutes.js";
import { logger, morganMiddleware } from "./utils/logger.js";

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morganMiddleware);

app.use("/api/v1", urlRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use((err, req, res, next) => {
  logger.error(err.message);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
});

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI, {
      maxPoolSize: 10000,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
});

export default app;
