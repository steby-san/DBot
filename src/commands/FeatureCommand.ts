import { SlashCommandBuilder, ChatInputCommandInteraction, Collection } from 'discord.js';
import Command from '@/types/Command';


// lấy avatar của người khác
const GetUserAvatarCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Lấy avatar của bạn hoặc người khác')
    .addUserOption(option =>
      option.setName('target')
        .setDescription('Người dùng mà bạn muốn lấy avatar')
        .setRequired(false)),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const target = interaction.options.getUser('target') || interaction.user;
      const avatarUrl = target.displayAvatarURL({ size: 256, extension: 'png', forceStatic: false });
      
      const embed = {
        color: 0x0099ff,
        title: `${target.username}'s Avatar`,
        image: {
          url: avatarUrl,
        },
        footer: {
          text: 'Yêu cầu bởi: ' + interaction.user.username
        }
      };
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi lệnh avatar:", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Đã có lỗi xảy ra khi lấy avatar!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Đã có lỗi xảy ra khi lấy avatar!', ephemeral: true });
      }
    }
  }
};

// Lắc xí ngầu
const RollDiceCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Lắc xí ngầu'),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const result = Math.floor(Math.random() * 6) + 1;
      await interaction.reply(`🎲 Bạn đã lắc được: ${result}`);
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi lệnh roll:", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Đã có lỗi xảy ra khi lắc xí ngầu!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Đã có lỗi xảy ra khi lắc xí ngầu!', ephemeral: true });
      }
    }
  }
};

// Tung xu
const FlipCoinCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Tung đồng xu'),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      const result = Math.random() < 0.5 ? 'Ngửa' : 'Sấp';
      await interaction.reply(`🪙 Kết quả: ${result}`);
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi lệnh flip:", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Đã có lỗi xảy ra khi tung đồng xu!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Đã có lỗi xảy ra khi tung đồng xu!', ephemeral: true });
      }
    }
  }
};

// Lấy ping của bot 
const GetPingCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ping của bot?'),
  async execute(interaction: ChatInputCommandInteraction) {
    const client = interaction.client;
    await interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
  }
};

// Shiping :')
const ShipCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('ship')
    .setDescription('Ship 2 người và kiểm tra độ tương thích')
    .addUserOption(option =>
      option.setName('user1')
        .setDescription('Người dùng 1')
        .setRequired(true))
    .addUserOption(option =>
      option.setName('user2')
        .setDescription('Người dùng 2')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    const user1 = interaction.options.getUser('user1');
    const user2 = interaction.options.getUser('user2');
    
    if (!user1 || !user2) {
      await interaction.reply('Vui lòng nhập tên người dùng');
      return;
    }
    
    const compatibility = Math.floor(Math.random() * 100) + 1;
    const embed = {
      color: 0x0099ff,
      title: `${user1.username} và ${user2.username}`,
      description: `Độ tương thích: ${compatibility}%`,
      image: {
        url: `https://cdn.discordapp.com/emojis/1369493738266693692.webp?size=128`
      }
    };
    await interaction.reply({ embeds: [embed] });
  }
}; 

const commandModules = [GetUserAvatarCommand, RollDiceCommand, FlipCoinCommand, GetPingCommand, ShipCommand];

const featureCommands = new Collection<string, Command>();

for (const command of commandModules) {
  featureCommands.set(command.data.name, command);
}

export default featureCommands;