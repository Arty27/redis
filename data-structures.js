const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6739,
});

client.on("error", (error) => console.log("error occured!", error));

async function redisDataStructures() {
  try {
    await client.connect();
    // Strings -> set, get, mset, mget
    await client.set("username", "master27");
    const name = await client.get("username");

    await client.mSet([
      "user:email",
      "master@gmail.com",
      "user:age",
      "35",
      "user:country",
      "India",
    ]);
    const [email, age, country] = await client.mGet([
      "user:email",
      "user:age",
      "user:country",
    ]);
    console.log(name, email, age, country);

    // list - lpush (push elements at start of list), rpush (push element at end of list)
    // list - lrange (get elements from specific range), lpop, rpop
    await client.lPush("countries", [
      "India",
      "Austrailia",
      "England",
      "China",
    ]);
    await client.rPush("countries", ["Ghana"]);
    const countries = await client.lRange("countries", 0, -1); // 0 and -1 will get all nodes
    console.log(countries);

    const pop = await client.lPop("countries");
    console.log(pop, await client.lRange("countries", 0, -1));
    await client.del("countries");

    // Sets -> sAdd, sMembers (return all elements of set), sIsMember, sRem (reomve)

    await client.sAdd("user:nickName", ["criminal", "mastermind", "genius"]);
    console.log(await client.sMembers("user:nickName"));

    const isNickName = await client.sIsMember("user:nickName", "genius"); // 0 for false, 1 for true
    await client.sRem("user:nickName", "genius");
    console.log(isNickName, await client.sMembers("user:nickName"));

    // Sorted sets -> zAdd, zRange, zRem, zRank
    await client.zAdd("cart", [
      { score: 100, value: "Cart1" },
      { score: 150, value: "Cart2" },
      { score: 10, value: "Cart3" },
      { score: 200, value: "Cart4" },
    ]);
    const getCartItems = await client.zRange("cart", 0, -1);
    console.log(getCartItems);
    const getItemsWithScore = await client.zRangeWithScores("cart", 0, -1);
    console.log(getItemsWithScore);

    const cartTwoRank = await client.zRank("cart", "Cart3");
    console.log(cartTwoRank);

    // Hashes -> hSet, hGet, hGetAll, hDel
    await client.hSet("cricket:1", {
      name: "Jasprith Bumrah",
      descr: "Right Hand Fast Bowler",
      rating: "5",
    });
    const getC = await client.hGet("cricket:1", "rating");
    console.log(getC);
    const getAllProperties = await client.hGetAll("cricket:1");
    console.log(getAllProperties);
  } catch (error) {
    console.log("Error occured", error);
  } finally {
    await client.quit();
  }
}

redisDataStructures();
