import { customAlphabet } from "nanoid";
import URL from "../models/URL.js";
import { AppError } from "../utils/errorHandlers.js";
import { logger } from "../utils/logger.js";
import validator from "validator";
const { isURL } = validator;

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  7
);

export const shortenUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body; 
    originalUrl.trim();
    if (isURL(originalUrl) === false) {
      throw new AppError("Invalid URL", 400);
    }
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
  } catch (err) {
    next(err);
  }
};

export const redirectToLongUrl = async (req, res, next) => {
  try {
    const { shortUrlKey } = req.params;
    shortUrlKey.trim();
    if (!shortUrlKey) {
      throw new AppError("Short URL is required", 400);
    }
    if (shortUrlKey.length !== 7) {
      throw new AppError("Incorrect Short URL", 400);
    }
    const url = await URL.findOneAndUpdate(
      {
        shortUrlKey,
      },
      {
        $inc: { clickCount: 1 },
      },
      {
        new: true,
        projection: { originalUrl: 1, clickCount: 1 },
        lean: true,
      }
    ).exec();
    if (!url || !url.originalUrl) {
      throw new AppError(`Short URL Key not found: ${shortUrlKey}`, 404);
    }
    logger.info(
      `Redirecting to original URL: ${url.originalUrl} for short URL: ${shortUrlKey} with click count: ${url.clickCount}`
    );
    res.status(200).json({
      message: "Redirecting to original URL",
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
    });
    // res.redirect(301, originalUrl);
  } catch (err) {
    next(err);
  }
};