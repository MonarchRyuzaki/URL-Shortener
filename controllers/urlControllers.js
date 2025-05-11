const mapShortUrltoLongUrl = new Map();
import { customAlphabet } from "nanoid";
import { logger } from "../utils/logger.js";

export const shortenUrl = (req, res) => {
  const { originalUrl } = req.body;
  const nanoid = customAlphabet(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    7
  );
  const shortUrl = `${process.env.BASE_URL}/api/v1/${nanoid()}`;
  mapShortUrltoLongUrl.set(shortUrl, originalUrl);
  logger.info(`Shortened URL: ${shortUrl} for original URL: ${originalUrl}`);
  res.status(200).json({
    message: "URL shortened successfully",
    originalUrl,
    shortUrl,
  });
};

export const redirectToLongUrl = (req, res) => {
  const { shortUrlKey } = req.params;
  const shortUrl = `${process.env.BASE_URL}/api/v1/${shortUrlKey}`;
  if (!mapShortUrltoLongUrl.has(shortUrl)) {
    logger.error(`Short URL not found: ${shortUrl}`);
    return res.status(404).json({
      message: "Short URL not found",
    });
  }
  const originalUrl = mapShortUrltoLongUrl.get(shortUrl);
  logger.info(
    `Redirecting to original URL: ${originalUrl} for short URL: ${shortUrl}`
  );
  res.redirect(302, originalUrl);
};
