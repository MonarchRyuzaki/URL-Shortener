import { customAlphabet } from "nanoid";
import validator from "validator";
import client from "../config/redis.js";
import URL from "../models/URL.js";
import { AppError } from "../utils/errorHandlers.js";
import { logger } from "../utils/logger.js";
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
      expiresIn: Math.floor(url.expiresAt - new Date()),
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
    const cachedUrl = await client.get(`shortUrlKey:${shortUrlKey}`);
    if (cachedUrl) {
      logger.info(
        `Cache hit for short URL: ${shortUrlKey}, redirecting to original URL: ${cachedUrl}`
      );
      res.status(200).json({
        message: "Redirecting to original URL",
        originalUrl: cachedUrl,
      });
      return;
    }
    logger.info(`Cache miss for short URL: ${shortUrlKey}, fetching from DB`);
    const url = await URL.findOneAndUpdate(
      {
        shortUrlKey,
      },
      {
        $inc: { clickCount: 1 },
      },
      {
        new: true,
        projection: { originalUrl: 1, clickCount: 1, expiresAt: 1 },
        lean: true,
      }
    ).exec();
    if (!url || !url.originalUrl) {
      throw new AppError(`Short URL Key not found: ${shortUrlKey}`, 404);
    }
    if (url.expiresAt < new Date()) {
      throw new AppError("Short URL has expired", 410);
    }
    logger.info(
      `Redirecting to original URL: ${url.originalUrl} for short URL: ${shortUrlKey} with click count: ${url.clickCount}`
    );
    client.set(`shortUrlKey:${shortUrlKey}`, url.originalUrl, {
      expiration: {
        type: "EX",
        value: Math.max(
          0,
          Math.min(Math.floor((url.expiresAt - new Date()) / 1000), 60 * 60)
        ),
      },
    });
    logger.info(`Cache set for short URL: ${shortUrlKey}`);
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

export const getUrlStats = async (req, res, next) => {
  try {
    const { shortUrlKey } = req.params;
    shortUrlKey.trim();
    if (!shortUrlKey) {
      throw new AppError("Short URL is required", 400);
    }
    if (shortUrlKey.length !== 7) {
      throw new AppError("Incorrect Short URL", 400);
    }
    const url = await URL.findOne(
      {
        shortUrlKey,
      },
      { originalUrl: 1, clickCount: 1, createdAt: 1, expiresAt: 1 }
    )
      .lean()
      .exec();
    if (!url || !url.originalUrl) {
      throw new AppError(`Short URL Key not found: ${shortUrlKey}`, 404);
    }
    logger.info(
      `Fetching stats for short URL: ${shortUrlKey} with original URL: ${url.originalUrl} and click count: ${url.clickCount}, createdAt: ${url.createdAt}`
    );
    res.status(200).json({
      message: "URL stats fetched successfully",
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      expiresIn: Math.floor(url.expiresAt - new Date()),
      status: url.expiresAt > new Date() ? "active" : "expired",
    });
  } catch (err) {
    next(err);
  }
};
