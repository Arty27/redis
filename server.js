const redis = require("redis");

const client = redis.createClient({ host: "localhost", port: 6739 });

client.on("error", (error) =>
  console.log("Redis client error occured!", error)
);

async function testRedisConnection() {
  try {
    await client.connect();
    console.log("Connected to redis!");
    await client.set("master", "ArtemisFowl");
    await client.set("master1", "ArtemisFowl");
    const extractValue = await client.get("master");
    console.log(extractValue);
    const deleteCount = await client.del(["master", "master1"]);
    // const deleteCount = await client.del(["master");
    console.log(deleteCount);
    await client.set("count", 100);
    const incrementCount = await client.incr("count");
    console.log(incrementCount);
  } catch (error) {
    console.log("error while connecting", error);
  } finally {
    await client.quit();
  }
}

testRedisConnection();
