import Ready from '@/events/Ready';
import { Client, Interaction, CacheType } from 'discord.js';
import commandCollection from '@/commands/FeatureCommand';

interface Event {
  name: string;
  once?: boolean;
  execute(...args: any[]): void;
}

// Lưu trữ các events
const events: Event[] = [
  Ready()
];

// reg các event cho client
const EventHandler = (client: Client) => {
  events.forEach((event: Event) => {
    const { name, once, execute } = event;
    const eventCallback = (...args: any[]) => execute(...args);
    if (once) {
      client.once(name, eventCallback);
    } else {
      client.on(name, eventCallback);
    }
  });

  client.on('ready', () => {
    if (client.user) {
      console.log(`✅ ${client.user.tag} đã sẵn sàng hoạt động!`);
    } else {
      console.log(`✅ Client đã sẵn sàng!`);
    }
  });

  client.on('interactionCreate', async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commandCollection.get(interaction.commandName);

    if (!command) {
      console.error(`Không tìm thấy lệnh ${interaction.commandName}.`);
      try {
        await interaction.reply({ content: 'Lệnh này không tồn tại hoặc đã bị lỗi!', ephemeral: true });
      } catch (replyError) {
        console.error('Lỗi khi gửi thông báo lệnh không tồn tại:', replyError);
      }
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Lỗi khi thực thi lệnh ${interaction.commandName}:`, error);
      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'Đã xảy ra lỗi khi thực thi lệnh này!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Đã xảy ra lỗi khi thực thi lệnh này!', ephemeral: true });
        }
      } catch (replyError) {
          console.error(`Lỗi khi gửi thông báo lỗi thực thi lệnh ${interaction.commandName}:`, replyError);
      }
    }
  });

}

export default EventHandler;
