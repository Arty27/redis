const Redis = require("ioredis");
// redis client library for node js

const client = new Redis();

const tryIoRedis = async () => {
  try {
    await client.set("key", "value");
    const val = await client.get("key");
    console.log(val);
  } catch (error) {
    console.log(error);
  } finally {
    client.quit();
  }
};

tryIoRedis();
