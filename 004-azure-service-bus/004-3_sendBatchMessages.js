const { ServiceBusClient } = require("@azure/service-bus");
require("dotenv").config();

const connectionString = process.env.AZURE_SB_CONNECTION_STRING;
const queueName = "queue001";

const azureSBClient = new ServiceBusClient(connectionString);
const batchSender = azureSBClient.createSender(queueName);

async function main() {
  console.log("About to send bulk");
  let myBatch = await batchSender.createMessageBatch();

  for (let i = 1; i <= 10; i++) {
    let message = {
      body: `Hello World! ${i}`,
      label: "greeting",
    };

    if (!myBatch.tryAddMessage(message)) {
      await batchSender.sendMessages(myBatch);
      console.log("Sent myBatch");

      myBatch = await batchSender.createMessageBatch();

      if (!myBatch.tryAddMessage(message)) {
        throw new Error("Message too big");
      }
    }
  }

  await batchSender.sendMessages(myBatch);
  console.log("sent last batch");

  await batchSender.close();
  await azureSBClient.close();
  console.log("After connection close");
}

main().catch((err) => {
  console.log(err);
});
