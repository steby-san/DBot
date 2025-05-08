import { SlashCommandBuilder, ChatInputCommandInteraction, Collection, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, User } from 'discord.js';
import Command from '@/types/Command';
import { setTwitterConfig } from '@/config/twitterConfig';
import { setCodeBlockConfig } from '@/config/codeBlockConfig';


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

// Bình chọn
const PollCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('Tạo bình chọn')
    .addStringOption(option =>
      option.setName('question')
        .setDescription('Câu hỏi bạn muốn hỏi')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('time')
        .setDescription('Thời gian bình chọn (phút)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option1')
        .setDescription('Lựa chọn 1')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option2')
        .setDescription('Lựa chọn 2')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('option3')
        .setDescription('Lựa chọn 3')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('option4')
        .setDescription('Lựa chọn 4')
        .setRequired(false)),
  async execute(interaction: ChatInputCommandInteraction) {
    const question = interaction.options.getString('question');
    const time = interaction.options.getString('time');
    const option1 = interaction.options.getString('option1');
    const option2 = interaction.options.getString('option2');
    const option3 = interaction.options.getString('option3');
    const option4 = interaction.options.getString('option4');
    
    if (!question || !time || !option1 || !option2) {
      await interaction.reply('Vui lòng nhập đầy đủ câu hỏi, thời gian và ít nhất 2 lựa chọn');
      return;
    }
    
    const options = [option1, option2];
    if (option3) options.push(option3);
    if (option4) options.push(option4);
    
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(question)
      .setDescription(`⏱️ Thời gian: ${time} phút\n\n${options.map((opt, i) => `${['1️⃣', '2️⃣', '3️⃣', '4️⃣'][i]} ${opt}`).join('\n')}`)
      .setFooter({ text: 'Bình chọn tạo bởi: ' + interaction.user.username });

    // Tạo các nút điều khiển
    const endButton = new ButtonBuilder()
      .setCustomId('end_poll')
      .setLabel('Kết thúc')
      .setStyle(ButtonStyle.Danger);

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel_poll')
      .setLabel('Hủy')
      .setStyle(ButtonStyle.Secondary);

    const resultButton = new ButtonBuilder()
      .setCustomId('show_result')
      .setLabel('Kết quả')
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(endButton, cancelButton, resultButton);

    const message = await interaction.reply({ 
      embeds: [embed], 
      components: [row],
      fetchReply: true 
    });

    // Thêm reactions
    const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
    for (let i = 0; i < options.length; i++) {
      await message.react(reactions[i]);
    }

    // Xử lý các nút
    const collector = message.createMessageComponentCollector({ 
      componentType: ComponentType.Button,
      time: parseInt(time) * 60 * 1000 // Chuyển phút thành milliseconds
    });

    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) {
        await i.reply({ content: 'Chỉ người tạo bình chọn mới có thể sử dụng các nút này!', ephemeral: true });
        return;
      }

      switch (i.customId) {
        case 'end_poll':
          await endPoll(message, options);
          await i.update({ components: [] });
          break;
        case 'cancel_poll':
          await message.edit({ 
            embeds: [embed.setColor(0xff0000).setDescription('❌ Bình chọn đã bị hủy')],
            components: [] 
          });
          await i.update({ components: [] });
          break;
        case 'show_result':
          await showResults(message, options);
          await i.deferUpdate();
          break;
      }
    });

    collector.on('end', async () => {
      if (message.components.length > 0) {
        await endPoll(message, options);
        await message.edit({ components: [] });
      }
    });
  }
};

async function endPoll(message: any, options: string[]) {
  const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
  
  // Fetch lại message để lấy reactions mới nhất
  const fetchedMessage = await message.fetch();
  
  const results = await Promise.all(
    reactions.slice(0, options.length).map(async (emoji, index) => {
      const reaction = fetchedMessage.reactions.cache.get(emoji);
      if (!reaction) return { option: options[index], count: 0 };
      
      // Fetch users của reaction
      const users = await reaction.users.fetch();
      // Đếm số người dùng (trừ bot)
      const count = users.filter((user: User) => !user.bot).size;
      
      return { option: options[index], count };
    })
  );

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0);
  const resultEmbed = new EmbedBuilder()
    .setColor(0x00ff00)
    .setTitle('📊 Kết quả bình chọn')
    .setDescription(
      results.map(r => 
        `${r.option}: ${r.count} phiếu (${totalVotes > 0 ? Math.round(r.count/totalVotes*100) : 0}%)`
      ).join('\n')
    )
    .setFooter({ text: `Tổng số phiếu: ${totalVotes}` });

  await message.reply({ embeds: [resultEmbed] });
}

async function showResults(message: any, options: string[]) {
  const reactions = ['1️⃣', '2️⃣', '3️⃣', '4️⃣'];
  
  // Fetch lại message để lấy reactions mới nhất
  const fetchedMessage = await message.fetch();
  
  const results = await Promise.all(
    reactions.slice(0, options.length).map(async (emoji, index) => {
      const reaction = fetchedMessage.reactions.cache.get(emoji);
      if (!reaction) return { option: options[index], count: 0 };
      
      // Fetch users của reaction
      const users = await reaction.users.fetch();
      // Đếm số người dùng (trừ bot)
      const count = users.filter((user: User) => !user.bot).size;
      
      return { option: options[index], count };
    })
  );

  const totalVotes = results.reduce((sum, r) => sum + r.count, 0);
  const resultEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle('📊 Kết quả hiện tại')
    .setDescription(
      results.map(r => 
        `${r.option}: ${r.count} phiếu (${totalVotes > 0 ? Math.round(r.count/totalVotes*100) : 0}%)`
      ).join('\n')
    )
    .setFooter({ text: `Tổng số phiếu: ${totalVotes}` });

  await message.reply({ embeds: [resultEmbed], ephemeral: true });
}

// Toggle tính năng tự động chuyển đổi link Twitter
const TwitterCommand: Command = {
  data: new SlashCommandBuilder()
    .setName('twitter')
    .setDescription('Bật/tắt tính năng tự động chuyển đổi link Twitter')
    .addBooleanOption(option =>
      option.setName('enabled')
        .setDescription('Bật hoặc tắt tính năng')
        .setRequired(true)),
  async execute(interaction: ChatInputCommandInteraction) {
    try {
      if (!interaction.guild) {
        await interaction.reply({ content: '❌ Lệnh này chỉ có thể sử dụng trong server!', ephemeral: true });
        return;
      }

      const enabled = interaction.options.getBoolean('enabled');
      if (enabled === null) {
        await interaction.reply({ content: '❌ Vui lòng chọn trạng thái bật/tắt!', ephemeral: true });
        return;
      }

      setTwitterConfig(interaction.guild.id, enabled);
      await interaction.reply({ 
        content: enabled ? 
          '✅ Đã bật tính năng tự động chuyển đổi link Twitter!' : 
          '❌ Đã tắt tính năng tự động chuyển đổi link Twitter!',
        ephemeral: true 
      });
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "Lỗi lệnh twitter:", error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
      }
    }
  }
};

// Toggle tính năng code blocks
const CodeBlockCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('codeblock')
        .setDescription('Bật/tắt tính năng tự động format code blocks')
        .addBooleanOption(option =>
            option.setName('enabled')
                .setDescription('Bật hoặc tắt tính năng')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            if (!interaction.guild) {
                await interaction.reply({ content: '❌ Lệnh này chỉ có thể sử dụng trong server!', ephemeral: true });
                return;
            }

            const enabled = interaction.options.getBoolean('enabled');
            if (enabled === null) {
                await interaction.reply({ content: '❌ Vui lòng chọn trạng thái bật/tắt!', ephemeral: true });
                return;
            }

            setCodeBlockConfig(interaction.guild.id, enabled);
            await interaction.reply({ 
                content: enabled ? 
                    '✅ Đã bật tính năng tự động format code blocks!' : 
                    '❌ Đã tắt tính năng tự động format code blocks!',
                ephemeral: true 
            });
        } catch (error) {
            console.error("\x1b[31m%s\x1b[0m", "Lỗi lệnh codeblock:", error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            }
        }
    }
};

const commandModules = [GetUserAvatarCommand, RollDiceCommand, FlipCoinCommand, GetPingCommand, ShipCommand, PollCommand, TwitterCommand, CodeBlockCommand];

const featureCommands = new Collection<string, Command>();

for (const command of commandModules) {
  featureCommands.set(command.data.name, command);
}

export default featureCommands;