import md5 from "md5";
import { redisA, redisB } from "../config/redis.js";

class ConsistentHash {
  constructor(servers, options = {}) {
    this.servers = servers;
    this.replicas = options.replicas || 10;
    this.sortedKeys = [];
    this.servers.forEach((element) => {
      this.addServer(element);
    });
    this.sortedKeys.sort((a, b) => a.pos - b.pos);
  }
  hash(key) {
    return parseInt(md5(key).slice(0, 8), 16);
  }
  addServer({ name, client }) {
    for (let i = 0; i < this.replicas; i++) {
      const serverKey = `${name}:${i}`;
      const hash = this.hash(serverKey);
      this.sortedKeys.push({ name, client, pos: hash });
    }
  }
  getServer(key) {
    if (this.sortedKeys.length === 0) return null;
    const hash = this.hash(key);
    let low = 0,
      high = this.sortedKeys.length - 1,
      ans = 0;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (this.sortedKeys[mid].pos >= hash) {
        ans = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }
    return {
      name: this.sortedKeys[ans].name,
      client: this.sortedKeys[ans].client,
    };
  }
}

const servers = [
  { name: "RedisA", client: redisA },
  { name: "RedisB", client: redisB },
];
export const hashRing = new ConsistentHash(servers, {
  replicas: 10,
});
