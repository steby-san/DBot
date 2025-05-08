import { SlashCommandBuilder, ChatInputCommandInteraction, Collection, SlashCommandOptionsOnlyBuilder } from 'discord.js';
import Command from '@/types/Command';

const GetServerInfoCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('server')
        .setDescription('Server info'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(`Sivi: ${interaction.guild?.name}\nSố thành viên: ${interaction.guild?.memberCount}`);
    }
};

const CountMessageCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('countmessage')
        .setDescription('Count message'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply(`Số lượng tin nhắn: ${interaction.channel?.messages.cache.size}`);
    }
};
