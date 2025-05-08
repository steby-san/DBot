import featureCommands from '@/commands/FeatureCommand';
import messageCommands from '@/commands/MessageCommand';
import { Client } from 'discord.js';

import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

const CommandHandler = (client: Client) => {

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN as string);

  (async () => {
    try {
      console.log('🔄 Đang đăng ký lại lệnh mới...');
      
      const featureCommandData = Array.from(featureCommands.values()).map(command => command.data.toJSON());
      const messageCommandData = Array.from(messageCommands.values()).map(command => command.data.toJSON());
      
      const commandData = [...featureCommandData, ...messageCommandData];

      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID as string, process.env.GUILD_ID as string),
        { body: commandData },
      );
      console.log('✅ Đăng ký lệnh thành công: ', commandData.map(command => command.name).join(', '));
      
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi khi đăng ký lệnh:", error);
    }    
  })();
}

export default CommandHandler;