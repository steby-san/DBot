import { Client, ActivityType, PresenceUpdateStatus, GuildMember } from 'discord.js';
import { getWelcomeConfig } from '@/config/welcomeConfig';

// Activity của con bot
interface RichPreProps {
  name: string;
  type: ActivityType;
  url: string;
}

const activityDetails: RichPreProps = {
  name: "Cooking myself",
  type: ActivityType.Streaming,
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
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
      client.user.setActivity(activityDetails.name, { 
        type: activityDetails.type,
        url: activityDetails.url 
      });
      client.user.setStatus(PresenceUpdateStatus.Online);
      console.log("Set RP thành công");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "e:", error);
    }

    // Xử lý sự kiện khi có thành viên mới tham gia
    client.on('guildMemberAdd', async (member: GuildMember) => {
      try {
        const config = getWelcomeConfig(member.guild.id);
        
        if (config) {
          const channel = member.guild.channels.cache.get(config.channelId);
          if (channel && channel.isTextBased()) {
            const welcomeMessage = config.message
              .replace('{user}', member.toString())
              .replace('{server}', member.guild.name);
            await channel.send(welcomeMessage);
          }
        } else {
          // Nếu không có cấu hình, sử dụng kênh mặc định
          const welcomeChannel = member.guild.channels.cache.find(channel => 
            channel.name.toLowerCase().includes('welcome') || 
            channel.name.toLowerCase().includes('chào-mừng')
          );

          if (welcomeChannel && welcomeChannel.isTextBased()) {
            const welcomeMessage = `Chào mừng ${member} đến với ${member.guild.name}! 🎉\nChúng tôi rất vui mừng khi có bạn tham gia!`;
            await welcomeChannel.send(welcomeMessage);
          }
        }
      } catch (error) {
        console.error('Lỗi khi gửi tin nhắn chào mừng:', error);
      }
    });
  },
});

export default Ready;