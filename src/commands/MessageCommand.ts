import { SlashCommandBuilder, ChatInputCommandInteraction, Collection } from 'discord.js';
import Command from '../types/Command';



// Tạo collection và thêm lệnh
const messageCommands = new Collection<string, Command>();

export default messageCommands;