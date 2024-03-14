const { ServiceBusClient } = require("@azure/service-bus");
require("dotenv").config();

const connectionString = process.env.AZURE_SB_CONNECTION_STRING;
const queueName = "queue001";

const azureSBClient = new ServiceBusClient(connectionString);
const receiver = azureSBClient.createReceiver(queueName);

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function main() {
  console.log("About to recieve messages");

  receiver.subscribe({
    processMessage: async (messages) => {
      console.log(`Received messages: ${messages.body}`);
    },
    processError: async (err) => {
      console.log("Occurered err: ", err);
    },
  });

  await delay(20000);

  await receiver.close();
  await azureSBClient.close();
  console.log("After connection close");
}

main();
