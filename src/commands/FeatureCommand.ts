import { SlashCommandBuilder, ChatInputCommandInteraction, Collection, SlashCommandOptionsOnlyBuilder } from 'discord.js';
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



const commandModules = [GetUserAvatarCommand, RollDiceCommand, FlipCoinCommand, GetPingCommand];

const featureCommands = new Collection<string, Command>();

for (const command of commandModules) {
  featureCommands.set(command.data.name, command);
}

export default featureCommands;