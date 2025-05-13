import { customAlphabet } from "nanoid";
import URL from "../models/URL.js";
import { logger } from "../utils/logger.js";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  7
);

export const shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const url = await URL.findOneAndUpdate(
    { originalUrl },
    { $setOnInsert: { originalUrl, shortUrlKey: nanoid() } },
    { new: true, upsert: true, setDefaultsOnInsert: true, lean: true }
  ).exec();
  const shortUrl = `${process.env.BASE_URL}/api/v1/${url.shortUrlKey}`;

  logger.info(
    `Shortened URL: ${shortUrl} for original URL: ${originalUrl} and saved to DB with ID: ${url._id}`
  );
  res.status(200).json({
    message: "URL shortened successfully",
    originalUrl,
    shortUrl,
  });
};

export const redirectToLongUrl = async (req, res) => {
  const { shortUrlKey } = req.params;
  const url = await URL.findOneAndUpdate({
    shortUrlKey,
  }, {
    $inc: { clickCount: 1 },
  }, {
    new: true,
    projection: { originalUrl: 1, clickCount: 1 },
    lean: true,
  }).exec();
  if (!url) {
    logger.error(`Short URL Key not found: ${shortUrlKey}`);
    return res.status(404).json({
      message: "Short URL not found",
    });
  }
  logger.info(
    `Redirecting to original URL: ${url.originalUrl} for short URL: ${shortUrlKey} with click count: ${url.clickCount}`
  );
  res.redirect(301, originalUrl);
};
