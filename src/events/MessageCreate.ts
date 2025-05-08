import { Message } from 'discord.js';
import { getTwitterConfig } from '@/config/twitterConfig';
import { getCodeBlockConfig } from '@/config/codeBlockConfig';

const SUPPORTED_LANGUAGES: Record<string, string> = {
    'js': 'javascript',
    'javascript': 'javascript',
    'ts': 'typescript',
    'typescript': 'typescript',
    'py': 'python',
    'python': 'python',
    'java': 'java',
    'cpp': 'cpp',
    'c++': 'cpp',
    'c': 'c',
    'cs': 'csharp',
    'csharp': 'csharp',
    'php': 'php',
    'rb': 'ruby',
    'ruby': 'ruby',
    'go': 'go',
    'golang': 'go',
    'rs': 'rust',
    'rust': 'rust',
    'swift': 'swift',
    'kt': 'kotlin',
    'kotlin': 'kotlin',
    'html': 'html',
    'css': 'css',
    'json': 'json',
    'xml': 'xml',
    'md': 'markdown',
    'markdown': 'markdown',
    'sql': 'sql',
    'sh': 'bash',
    'bash': 'bash',
    'shell': 'bash',
    'yml': 'yaml',
    'yaml': 'yaml'
};

const MessageCreate = () => ({
    name: 'messageCreate',
    once: false,
    execute(message: Message) {
        // Bỏ qua tin nhắn từ bot
        if (message.author.bot) return;

        // Kiểm tra xem tính năng có được bật trong server này không
        if (!message.guild) return;

        handleTwitterLinks(message);
        handleCodeBlocks(message);
    }
});

const handleTwitterLinks = async (message: Message) => {
    if (!message.guild || !getTwitterConfig(message.guild.id)) return;

    // Regex để tìm link Twitter
    const twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/g;
    const twitterMatches = [...message.content.matchAll(twitterRegex)];

    if (twitterMatches.length === 0) return;

    // Chuyển đổi mỗi link Twitter thành fxtwitter
    const convertedLinks = twitterMatches.map(match => {
        const [_, username, statusId] = match;
        return `https://fxtwitter.com/${username}/status/${statusId}`;
    });

    try {
        // Gửi tin nhắn với link đã chuyển đổi
        await message.reply({
            content: `🔗 ${convertedLinks.join('\n')}`,
            allowedMentions: { repliedUser: false }
        });

        // Xóa embed của link Twitter người dùng gửi
        if (message.embeds.length > 0) {
            await message.suppressEmbeds(true);
        }
    } catch (error) {
        console.error('Lỗi khi xử lý Twitter links:', error);
    }
};

const detectLanguage = (code: string, specifiedLang: string): string => {
    // Nếu người dùng đã chỉ định ngôn ngữ, kiểm tra xem có trong danh sách hỗ trợ không
    if (specifiedLang) {
        const normalizedLang = specifiedLang.toLowerCase();
        return SUPPORTED_LANGUAGES[normalizedLang] || normalizedLang;
    }

    // Nếu không có ngôn ngữ được chỉ định, thử đoán từ nội dung code
    // Kiểm tra các dấu hiệu đặc trưng của ngôn ngữ
    if (code.includes('<?php')) return 'php';
    if (code.includes('<!DOCTYPE html>') || code.includes('<html>')) return 'html';
    if (code.includes('import React')) return 'javascript';
    if (code.includes('from typing import')) return 'python';
    if (code.includes('package main')) return 'go';
    if (code.includes('fn main()')) return 'rust';
    if (code.includes('public class')) return 'java';
    if (code.includes('SELECT') || code.includes('INSERT')) return 'sql';
    
    // Mặc định là plaintext nếu không nhận diện được
    return 'plaintext';
};

const handleCodeBlocks = async (message: Message) => {
    if (!message.guild || !getCodeBlockConfig(message.guild.id)) return;

    // Regex để tìm code format
    const codeRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const codeMatches = [...message.content.matchAll(codeRegex)];

    if (codeMatches.length === 0) return;

    try {
        const formattedCodes = codeMatches.map(match => {
            const [_, specifiedLang, code] = match;
            const trimmedCode = code.trim();
            const detectedLang = detectLanguage(trimmedCode, specifiedLang);
            return `\`\`\`${detectedLang}\n${trimmedCode}\`\`\``;
        });

        // Xóa tin nhắn gốc
        await message.delete();

        // Kiểm tra nếu channel là text channel và có thể gửi tin nhắn
        if (message.channel.isTextBased() && !message.channel.isDMBased()) {
            // Gửi tin nhắn mới với code đã format
            await message.channel.send({
                content: formattedCodes.join('\n\n'),
                allowedMentions: { users: [] }
            });
        }
    } catch (error) {
        console.error('Lỗi khi xử lý code blocks:', error);
    }
};

export default MessageCreate; 