import { Router } from "express";
import { customAlphabet } from "nanoid";
import { generateShortURL } from "../utils/generateShortURL.js";
const router = Router();

const mapShortUrltoLongUrl = new Map();

router.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;
  const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);
//   const currentID = nanoid();
//   console.log(currentID);
  const shortUrl = `${process.env.BASE_URL}/api/v1/${nanoid()}`;
  mapShortUrltoLongUrl.set(shortUrl, originalUrl);

  res.status(200).json({
    message: "URL shortened successfully",
    originalUrl,
    shortUrl,
  });
});

router.get("/:shortUrlKey", (req, res) => {
  const { shortUrlKey } = req.params;
  const shortUrl = `${process.env.BASE_URL}/api/v1/${shortUrlKey}`;
  if (!mapShortUrltoLongUrl.has(shortUrl)) {
    return res.status(404).json({
      message: "Short URL not found",
    });
  }
  const originalUrl = mapShortUrltoLongUrl.get(shortUrl);
  res.status(201).json({
    message: "Redirecting to original URL",
    originalUrl,
  });
//   res.redirect(302, originalUrl);
});

router.get("/test", (req, res) => {
  res.status(200).json({
    message: "Test route is working",
  });
});

router.post("/test", (req, res) => {
  const { name } = req.body;
  res.status(200).json({
    message: `Hello ${name}`,
  });
});

export default router;
