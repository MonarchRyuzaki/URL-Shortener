import dotenv from "dotenv";
import { createClient } from "redis";
dotenv.config();

class RedisClient {
  constructor(HOST, PORT, PASSWORD) {
    this.client = createClient({
      username: "default",
      password: PASSWORD,
      socket: {
        host: HOST,
        port: PORT,
      },
    });
    this.client.on("connect", () => {
      console.log("Connected to Redis");
    });
    this.client.on("ready", () => {
      console.log("Redis is ready");
    });
    this.client.on("end", () => {
      console.log("Redis connection closed");
    });
    this.client.on("error", (err) => {
      console.log("Redis Client Error", err);
    });
  }
}

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)  // >>> bar
const redisA = new RedisClient(
  process.env.REDIS_HOST1,
  process.env.REDIS_PORT1,
  process.env.REDIS_PASSWORD1
).client;

const redisB = new RedisClient(
  process.env.REDIS_HOST2,
  process.env.REDIS_PORT2,
  process.env.REDIS_PASSWORD2
).client;

export { redisA, redisB };
