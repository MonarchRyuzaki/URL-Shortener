import express, { json, urlencoded } from "express";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.BASE_URL);

// Importing the URL routes
import urlRoutes from "./routes/urlRoutes.js";

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(json());
app.use(urlencoded({ extended: false }));

app.use("/api/v1", urlRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

export default app;
