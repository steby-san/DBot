import { SlashCommandBuilder, ChatInputCommandInteraction, Collection } from 'discord.js';
import Command from '@/types/Command';
import { setWelcomeConfig } from '@/config/welcomeConfig';

const GetServerInfoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Server info'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            await interaction.editReply(`Sivi: ${interaction.guild?.name}\nSố thành viên: ${interaction.guild?.memberCount}`);
        } catch (error) {
            console.error('Lỗi lệnh server:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            } else {
                await interaction.editReply('Đã có lỗi xảy ra!');
            }
        }
    }
};

// Đếm số lượng tin nhắn trong server
const CountMessageCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('countmessage')
        .setDescription('Count message'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            await interaction.editReply(`Số lượng tin nhắn: ${interaction.channel?.messages.cache.size}`);
        } catch (error) {
            console.error('Lỗi lệnh countmessage:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            } else {
                await interaction.editReply('Đã có lỗi xảy ra!');
            }
        }
    }
};

// Lệnh để xem số lượng thành viên trong server
const CountMembersCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('countmembers')
        .setDescription('Count members'),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            await interaction.editReply(`Số lượng thành viên: ${interaction.guild?.memberCount}`);
        } catch (error) {
            console.error('Lỗi lệnh countmembers:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            } else {
                await interaction.editReply('Đã có lỗi xảy ra!');
            }
        }
    }
};

// Setup chào mừng thành viên mới
const WelcomeMessageCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('welcomemessage')
        .setDescription('Setup welcome message')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Kênh để gửi tin nhắn chào mừng')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Tin nhắn chào mừng (dùng {user} và {server} để thay thế)')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();
            
            const channel = interaction.options.getChannel('channel');
            const message = interaction.options.getString('message');

            if (!channel || !message || !interaction.guild) {
                await interaction.editReply('Vui lòng cung cấp kênh và tin nhắn chào mừng');
                return;
            }

            // Lưu cấu hình
            setWelcomeConfig(interaction.guild.id, channel.id, message);

            await interaction.editReply(`Đã thiết lập tin nhắn chào mừng trong kênh ${channel} là: ${message}`);
        } catch (error) {
            console.error('Lỗi lệnh welcomemessage:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ content: 'Đã có lỗi xảy ra!', ephemeral: true });
            } else {
                await interaction.editReply('Đã có lỗi xảy ra!');
            }
        }
    }
};

const commandModules = [GetServerInfoCommand, CountMessageCommand, CountMembersCommand, WelcomeMessageCommand];

const serverCommands = new Collection<string, Command>();

for (const command of commandModules) {
    serverCommands.set(command.data.name, command);
}

export default serverCommands;