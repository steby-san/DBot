import featureCommands from '@/commands/FeatureCommand';
import messageCommands from '@/commands/MessageCommand';
import serverCommands from '@/commands/ServerCommand';
import adminCommands from '@/commands/AdminCommand';
import { Client, Events } from 'discord.js';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const CommandHandler = (client: Client) => {
  
  if (!process.env.TOKEN) {
    console.error('❌ Không tìm thấy TOKEN trong file .env');
    return;
  }

  // Xử lý sự kiện interactionCreate
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = messageCommands.get(interaction.commandName) || 
                  featureCommands.get(interaction.commandName) || 
                  serverCommands.get(interaction.commandName) ||
                  adminCommands.get(interaction.commandName);
    
    if (!command) {
      console.error(`❌ Không tìm thấy lệnh: ${interaction.commandName}`);
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: 'Lệnh này không tồn tại hoặc đã bị lỗi!',
            ephemeral: true
          });
        }
      } catch (error) {
        console.error('Không thể gửi thông báo lỗi:', error);
      }
      return;
    }

    try {
      // Thêm timeout cho việc thực thi lệnh
      const timeout = setTimeout(async () => {
        if (!interaction.replied && !interaction.deferred) {
          try {
            await interaction.reply({ 
              content: 'Lệnh đã hết thời gian chờ!',
              ephemeral: true
            });
          } catch (error) {
            console.error('Không thể gửi thông báo timeout:', error);
          }
        }
      }, 3000); // 3 giây timeout

      await command.execute(interaction);
      clearTimeout(timeout);
    } catch (error) {
      console.error(`❌ Lỗi khi thực thi lệnh ${interaction.commandName}:`, error);
      try {
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ 
            content: 'Đã xảy ra lỗi khi thực hiện lệnh!',
            ephemeral: true
          });
        } else if (interaction.deferred) {
          await interaction.editReply({ content: 'Đã xảy ra lỗi khi thực hiện lệnh!' });
        }
      } catch (replyError) {
        console.error('Không thể gửi thông báo lỗi:', replyError);
      }
    }
  });

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  (async () => {
    try {
      console.log('🔄 Đang đăng ký lại lệnh mới...');
      
      const featureCommandData = Array.from(featureCommands.values()).map(command => command.data.toJSON());
      const messageCommandData = Array.from(messageCommands.values()).map(command => command.data.toJSON());
      const serverCommandData = Array.from(serverCommands.values()).map(command => command.data.toJSON());
      const adminCommandData = Array.from(adminCommands.values()).map(command => command.data.toJSON());

      console.log('📝 Danh sách lệnh message:', messageCommandData.map(cmd => cmd.name));
      console.log('📝 Danh sách lệnh feature:', featureCommandData.map(cmd => cmd.name));
      console.log('📝 Danh sách lệnh server:', serverCommandData.map(cmd => cmd.name));
      console.log('📝 Danh sách lệnh admin:', adminCommandData.map(cmd => cmd.name));

      const commandData = [...featureCommandData, ...messageCommandData, ...serverCommandData, ...adminCommandData];

      if (!process.env.CLIENT_ID || !process.env.GUILD_ID) {
        throw new Error('Thiếu CLIENT_ID hoặc GUILD_ID trong file .env');
      }

      console.log('🔑 Đang đăng ký lệnh với:');
      console.log('- CLIENT_ID:', process.env.CLIENT_ID);
      console.log('- GUILD_ID:', process.env.GUILD_ID);
      
      const response = await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commandData },
      );
      
      console.log('✅ Đăng ký lệnh thành công!');
      console.log('📋 Danh sách lệnh đã đăng ký:', (response as any[]).map(cmd => cmd.name).join(', '));
      
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi khi đăng ký lệnh:", error);
      if (error instanceof Error) {
        console.error('Chi tiết lỗi:', error.message);
        console.error('Stack trace:', error.stack);
      }
    }    
  })();
}

export default CommandHandler;