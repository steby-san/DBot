import { config } from "dotenv";
config();

import { Client, GatewayIntentBits } from "discord.js";
import EventHandler from "@/handlers/EventHandler";
import CommandHandler from "@/handlers/CommandHandler";

const TOKEN = process.env.TOKEN;
if (!TOKEN) {
  console.error("Check env");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
}); 

const start = async () => {
  await client.login(TOKEN);
}

try {
  start();
  EventHandler(client);
  CommandHandler(client);  
} catch (error) {
  console.error("\x1b[31m%s\x1b[0m", "e lỗi:", error);
  process.exit(1);
}