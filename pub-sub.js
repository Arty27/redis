const redis = require("redis");

const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.on("error", (error) =>
  console.log("Redis client error occured!", error)
);

async function testAdditionalFeatures() {
  try {
    await client.connect();
    // const subscriber = client.duplicate(); // create a new client -> shares same connection
    // await subscriber.connect(); // connect to redis server for the subscriber

    // await subscriber.subscribe("demo-channel", (message, channel) => {
    //   console.log(`Recieved Message from ${channel}:${message}`);
    // });

    // // publish message to the demo channel
    // await client.publish(
    //   "demo-channel",
    //   "Thank you for subscribing to my channel"
    // );
    // await client.publish(
    //   "demo-channel",
    //   "Press the bell icon for notifications"
    // );
    // await new Promise((resolve) => setTimeout(resolve, 1000));
    // await subscriber.unsubscribe("demo-channel");
    // await subscriber.quit();

    // pipelining and transactions
    const multi = client.multi();
    multi.set("boom", "Bumrah");
    multi.set("king", "Kohli");
    multi.get("boom");
    multi.get("king");

    const results = await multi.exec();
    console.log(results);

    console.log("Performance test");
    const pipeline1 = client.multi();
    console.time("with pipelining");
    for (let i = 0; i < 1000; i++) {
      pipeline1.set(`User:${i}`, `Action:${i}`);
    }
    await pipeline1.exec();
    console.timeEnd("with pipelining");

    // const demoExample = client.multi();
    // demoExample.decrBy("account:1234:Balance", "100");
    // demoExample.incrBy("account:1234:Balance", "100");
    // console.log(demoExample);
    // const finalResults = await demoExample.exec();

    console.time("without pipelining");
    for (let j = 0; j < 1000; j++) {
      await client.set(`without_P${j}`, `Action${j}`);
    }
    console.timeEnd("without pipelining");
  } catch (error) {
    console.log("Error occured while connecting", error);
  } finally {
    await client.quit();
  }
}

testAdditionalFeatures();
