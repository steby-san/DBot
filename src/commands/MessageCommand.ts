import { SlashCommandBuilder, ChatInputCommandInteraction, Collection } from 'discord.js';
import Command from '@/types/Command';

const SendMessageCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('send')
        .setDescription('Gửi tin nhắn đến tất cả các thành viên trong server')
        .addStringOption(option =>
            option.setName('message')
                .setDescription('Nội dung tin nhắn')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const message = interaction.options.getString('message');
        if (!message) {
            await interaction.reply({ content: 'Vui lòng nhập nội dung tin nhắn', ephemeral: true });
            return;
        }
        interaction.reply({ content: message});
    }
};

const SendEmojiCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Gửi emoji đến tất cả các thành viên trong server')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Nội dung emoji')
                .setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction) {
        const emoji = interaction.options.getString('emoji');
        if (!emoji) {
            await interaction.reply({ content: 'Vui lòng nhập nội dung emoji', ephemeral: true });
            return;
        }
        interaction.reply({ content: emoji });
    }
};

const commandModules = [SendMessageCommand, SendEmojiCommand];

const messageCommands = new Collection<string, Command>();

for (const command of commandModules) {
    messageCommands.set(command.data.name, command);
}

export default messageCommands;