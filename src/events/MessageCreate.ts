import { Message } from 'discord.js';
import { getTwitterConfig } from '@/config/twitterConfig';

const MessageCreate = () => ({
    name: 'messageCreate',
    once: false,
    execute(message: Message) {
        // Bỏ qua tin nhắn từ bot
        if (message.author.bot) return;

        // Kiểm tra xem tính năng có được bật trong server này không
        if (!message.guild || !getTwitterConfig(message.guild.id)) return;

        // Regex để tìm link Twitter
        const twitterRegex = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/(\w+)\/status\/(\d+)/g;
        
        // Tìm tất cả các link Twitter trong tin nhắn
        const matches = [...message.content.matchAll(twitterRegex)];
        
        if (matches.length > 0) {
            // Chuyển đổi mỗi link Twitter thành fxtwitter
            const convertedLinks = matches.map(match => {
                const [fullMatch, username, statusId] = match;
                return `https://fxtwitter.com/${username}/status/${statusId}`;
            });

            // Gửi tin nhắn với link đã chuyển đổi
            message.reply({
                content: `🔗${convertedLinks.join('\n')}`,
                allowedMentions: { repliedUser: false }
            }).then(() => {
                // Xóa embed của link Twitter người dùng gửi
                if (message.embeds.length > 0) {
                    message.suppressEmbeds(true).catch(error => {
                        console.error('Không thể xóa embed:', error);
                    });
                }
            });
        }
    }
});

export default MessageCreate; 