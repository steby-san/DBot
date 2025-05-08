import { Client, ActivityType, PresenceUpdateStatus } from 'discord.js';

// Activity của con bot
interface RichPreProps {
  name: string;
  type: ActivityType;
  url?: string;
}
const activityDetails: RichPreProps = {
  name: "Maidon đi ngủ",
  type: ActivityType.Watching,
  // Streaming, Listening, Watching, Competing, Custom
};

const Ready = () => ({
  name: 'ready',
  once: true, 
  execute(client: Client) {
    console.log('------------------');
    console.log(`🚀 Bot đã được deploy thành công và online để sẵn sàng phục vụ: ${client.user?.tag}`);
    console.log(`📡 Số lượng server: ${client.guilds.cache.size}`);
    console.log('Servers:');
    client.guilds.cache.forEach((guild: any) => {
      console.log(`🖥️- ${guild.name} (id: ${guild.id})`);
    });
    console.log('------------------');

    try {
      if (!client.user) {
        console.error("\x1b[31m%s\x1b[0m", "e: Client user is not available.");
        return;
      }
      client.user.setPresence({
        activities: [{
          name: activityDetails.name,
          type: activityDetails.type,
          url: activityDetails.url,
        }],
        status: PresenceUpdateStatus.Online,
      });
      console.log("Set RP thành công");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "e:", error);
    }
  },
});


export default Ready;