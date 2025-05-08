import { Client, ActivityType, PresenceUpdateStatus, GuildMember, Role } from 'discord.js';
import { getWelcomeConfig } from '../config/welcomeConfig';

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

// Hàm gán role với cơ chế retry
const assignRoleWithRetry = async (member: GuildMember, role: Role, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            await member.roles.add(role);
            return true;
        } catch (error: any) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
    return false;
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
          // Gửi tin nhắn chào mừng nếu có cấu hình
          if (config.channelId && config.message) {
            const channel = member.guild.channels.cache.get(config.channelId);
            if (channel && channel.isTextBased()) {
              const welcomeMessage = config.message
                .replace('{user}', member.toString())
                .replace('{server}', member.guild.name);
              await channel.send(welcomeMessage);
            }
          }

          // Tự động gán role nếu có cấu hình
          if (config.roleId) {
            const role = member.guild.roles.cache.get(config.roleId);
            if (role) {
              try {
                await assignRoleWithRetry(member, role);
                console.log(`Đã tự động gán role ${role.name} cho ${member.user.tag}`);
              } catch (error: any) {
                console.error(`Lỗi khi gán role ${role.name} cho ${member.user.tag}:`, error);
                
                // Thông báo chi tiết cho admin
                const adminChannel = member.guild.channels.cache.find(ch => 
                  ch.name.toLowerCase().includes('admin') || 
                  ch.name.toLowerCase().includes('mod')
                );
                
                if (adminChannel?.isTextBased()) {
                  await adminChannel.send({
                    content: `⚠️ Lỗi khi gán role ${role.name} cho ${member.user.tag}:\n${error.message}`
                  });
                }
              }
            } else {
              console.error(`Không tìm thấy role với ID ${config.roleId} trong server ${member.guild.name}`);
            }
          } else {
            console.log(`[DEBUG] Không có roleId trong config cho server ${member.guild.id}`);
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
        console.error('Lỗi khi xử lý thành viên mới:', error);
      }
    });
  },
});

export default Ready;