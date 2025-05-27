import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import nodeCron from "node-cron";
import URL from "../models/URL.js";
import { hashRing } from "../utils/consistentHash.js";

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🔗 MongoDB Connected");

  const redis = hashRing.getServer("clicks");
  await redis.client.connect();

  const STREAM = "clicks";
  const GROUP = "click-counter";
  const CONSUMER = "worker1";

  async function performBulkWrite() {
    let response;
    try {
      response = await redis.client.xReadGroup(
        GROUP,
        CONSUMER,
        { key: STREAM, id: ">" },
        { COUNT: 5000, BLOCK: 5000 }
      );
    } catch (err) {
      console.error("XREADGROUP error:", err);
      return;
    }
    console.log("→ XREADGROUP response:", response);
    if (!response || response.length === 0) {
      console.log("No new messages to process");
      return;
    }
    if (!response) {
      // timed out → loop again
      return;
    }

    const messages = response[0].messages;
    const toAck = [];
    const counter = new Map();

    for (const { id, message } of messages) {
      toAck.push(id);
      const key = message.shortUrlKey;
      counter.set(key, (counter.get(key) || 0) + 1);
    }

    const ops = Array.from(counter.entries()).map(([shortUrlKey, inc]) => ({
      updateOne: {
        filter: { shortUrlKey },
        update: { $inc: { clickCount: inc } },
      },
    }));

    try {
      const result = await URL.bulkWrite(ops, { ordered: false });
      console.log("BulkWrite result:", result);
      if (result.matchedCount === 0) {
        console.log("No documents matched the filter. No updates were made.");
      } else {
        console.log(
          `Updated ${result.modifiedCount} documents out of ${result.matchedCount} matched.`
        );
      }
      console.log("→ BulkWrite OK:", ops.length, "ops");
    } catch (err) {
      console.error("BulkWrite ERROR:", err);
      return;
    }

    try {
      const acked = await redis.client.xAck(STREAM, GROUP, toAck);
      console.log(`→ Acknowledged ${acked} messages`);
    } catch (err) {
      console.error("XACK error:", err);
    }
  }
  try {
    await performBulkWrite();
  } catch (e) {
    mongoose.disconnect();
    console.error("Error in performBulkWrite:", e);
    await redis.client.quit();
    return;
  }
}

nodeCron.schedule("*/10 * * * *", async () => {
  try {
    console.log("Running scheduled task to perform bulk write");
    await main();
    console.log("Scheduled task completed");
  } catch (err) {
    console.error("Error in scheduled task:", err);
  } finally {
    mongoose.disconnect();
    hashRing.getServer("clicks").client.quit();
  }
});
