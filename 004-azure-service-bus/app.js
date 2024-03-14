// import { ServiceBusClient } from "azure/service-bus";
const { ServiceBusClient } = require("@azure/service-bus");
require("dotenv").config();

console.log(process.env);

const connectionString = process.env.AZURE_SB_CONNECTION_STRING;

const queueName = "queue001";

const azureSBClient = new ServiceBusClient(connectionString);

const sender = azureSBClient.createSender(queueName);

async function sendMessage() {
  const messages = [
    { body: "Body A" },
    { body: "Body b" },
    { body: "Body C" },
    { body: "Body D" },
  ];

  await sender.sendMessages(messages);
  console.log("sent the messages");
}

sendMessage()
  .then(() => {
    return sender.close();
  })
  .then(() => {
    return azureSBClient.close();
  })
  .catch((err) => {
    console.log(err);
  });
