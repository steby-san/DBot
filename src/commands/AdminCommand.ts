import { SlashCommandBuilder, ChatInputCommandInteraction, Collection, PermissionsBitField, EmbedBuilder, Colors } from 'discord.js';
import Command from '../types/Command';
// Trao quyền lực cho con bot

const BanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban một thành viên')
        .addUserOption(option => option.setName('user').setDescription('User cần ban').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Lý do').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') ?? 'Không nói nhiều';

        if (!targetUser) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('❌ Lỗi')
                .setDescription('Không tìm thấy user!')
                .setTimestamp();
            
            await interaction.reply({ 
                embeds: [errorEmbed]
            });
            return;
        }

        const targetMember = interaction.guild?.members.cache.get(targetUser.id);
        const adminPermission = [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.ManageChannels, PermissionsBitField.Flags.Administrator];
        
        if (adminPermission.some(permission => targetMember?.permissions.has(permission))) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('❌ Lỗi')
                .setDescription(`Ai cho ban ${targetUser.username}!`)
                .setTimestamp();
            
            await interaction.reply({  
                embeds: [errorEmbed]
            });
            return;
        }

        try {
            await targetMember?.ban({ reason });
            
            const successEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('✅ Ban Thành Công')
                .setDescription(`Đã ban thành viên ${targetUser.username}`)
                .addFields(
                    { name: 'Thành viên', value: `${targetUser.tag}`, inline: true },
                    { name: '📝 Lý do', value: reason, inline: true },
                    { name: '🛡️ Bởi', value: `${interaction.user.tag}`, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ 
                embeds: [successEmbed]
            });
        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('❌ Lỗi')
                .setDescription('Không thể ban thành viên này!')
                .setTimestamp();
            
            await interaction.reply({ 
                embeds: [errorEmbed]
            });
        }
    }
}

const unbanCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban một thành viên')
        .addStringOption(option => option.setName('user').setDescription('ID của user cần unban').setRequired(true)),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        const userId = interaction.options.getString('user');
        if (!userId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('❌ Lỗi')
                .setDescription('Vui lòng nhập ID của user!')
                .setTimestamp();
            
            await interaction.reply({ 
                embeds: [errorEmbed]
            });
            return;
        }

        try {
            // Lấy danh sách ban
            const bans = await interaction.guild?.bans.fetch();
            const bannedUser = bans?.find(ban => ban.user.id === userId);

            if (!bannedUser) {
                const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setTitle('❌ Lỗi')
                    .setDescription('Không tìm thấy user trong danh sách ban!')
                    .setTimestamp();
                
                await interaction.reply({ 
                    embeds: [errorEmbed]
                });
                return;
            }

            // Thực hiện unban
            await interaction.guild?.members.unban(userId);

            const successEmbed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('✅ Unban Thành Công')
                .setDescription(`Đã unban thành viên ${bannedUser.user.tag}`)
                .addFields(
                    { name: '👤 Thành viên', value: bannedUser.user.tag, inline: true },
                    { name: '🛡️ Bởi', value: interaction.user.tag, inline: true }
                )
                .setThumbnail(bannedUser.user.displayAvatarURL())
                .setTimestamp();

            await interaction.reply({ 
                embeds: [successEmbed]
            });

        } catch (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle('❌ Lỗi')
                .setDescription('Không thể unban thành viên này!')
                .setTimestamp();
            
            await interaction.reply({ 
                embeds: [errorEmbed]
            });
        }   
    }
}  

const MuteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute một thành viên')
        .addUserOption(option => option.setName('target').setDescription('User cần mute').setRequired(true))
        .addStringOption(option => option.setName('duration').setDescription('Thời gian (ví dụ: 1h30m, 10m, 30s)').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Lý do').setRequired(false))
        .addBooleanOption(option => option.setName('silent').setDescription('Ẩn thông báo với user bị mute?').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers) &&
            !interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này!', ephemeral: true });
            return;
        }

        const targetUser = interaction.options.getUser('target');
        const durationStr = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') ?? 'Không nói nhiều';
        const silent = interaction.options.getBoolean('silent') ?? false;

        if (!targetUser || !durationStr) {
            await interaction.reply({ content: 'Thiếu thông tin!', ephemeral: true });
            return;
        }

        // Parse duration
        const match = durationStr.match(/(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?/);
        if (!match) {
            await interaction.reply({ content: 'Sai định dạng thời gian!', ephemeral: true });
            return;
        }
        const hours = parseInt(match[1] ?? '0');
        const minutes = parseInt(match[2] ?? '0');
        const seconds = parseInt(match[3] ?? '0');
        const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
        if (durationMs <= 0) {
            await interaction.reply({ content: 'Thời gian phải lớn hơn 0!', ephemeral: true });
            return;
        }

        const targetMember = interaction.guild?.members.cache.get(targetUser.id);
        if (!targetMember) {
            await interaction.reply({ content: 'Không tìm thấy thành viên!', ephemeral: true });
            return;
        }

        if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator) ||
            targetMember.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            await interaction.reply({ content: `Không thể mute ${targetUser.username}!`, ephemeral: true });
            return;
        }

        try {
            await targetMember.timeout(durationMs, reason);

            const embed = new EmbedBuilder()
                .setColor(Colors.Orange)
                .setTitle('🔇 Đã mute thành viên')
                .addFields(
                    { name: '👤 Thành viên', value: targetUser.tag, inline: true },
                    { name: '⏰ Thời gian', value: durationStr, inline: true },
                    { name: '📝 Lý do', value: reason, inline: true },
                    { name: '🛡️ Bởi', value: interaction.user.tag, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            if (silent) {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            if (!silent) {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            await interaction.reply({ content: 'Không thể mute thành viên này!', ephemeral: true });
        }
    }
};

const UnmuteCommand: Command = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute một thành viên')
        .addUserOption(option => option.setName('target').setDescription('User cần unmute').setRequired(true))
        .addBooleanOption(option => option.setName('silent').setDescription('Ẩn thông báo với user bị unmute?').setRequired(false)),
    async execute(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.ModerateMembers) &&
            !interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
            await interaction.reply({ content: 'Bạn không có quyền sử dụng lệnh này!', ephemeral: true });
            return;
        }

        const targetUser = interaction.options.getUser('target');
        const silent = interaction.options.getBoolean('silent') ?? false;

        if (!targetUser) {
            await interaction.reply({ content: 'Thiếu thông tin!', ephemeral: true });
            return;
        }

        const targetMember = interaction.guild?.members.cache.get(targetUser.id);
        if (!targetMember) {
            await interaction.reply({ content: 'Không tìm thấy thành viên!', ephemeral: true });
            return;
        }

        if (targetMember.permissions.has(PermissionsBitField.Flags.Administrator) ||
            targetMember.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            await interaction.reply({ content: 'Không thể unmute admin hoặc mod!', ephemeral: true });
            return;
        }

        try {
            await targetMember.timeout(null);

            const embed = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('🔊 Đã unmute thành viên')
                .addFields(
                    { name: '👤 Thành viên', value: targetUser.tag, inline: true },
                    { name: '🛡️ Bởi', value: interaction.user.tag, inline: true }
                )
                .setThumbnail(targetUser.displayAvatarURL())
                .setTimestamp();

            if (silent) {
                await interaction.reply({ embeds: [embed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [embed] });
            }
        } catch (error) {
            await interaction.reply({ content: 'Không thể unmute thành viên này!', ephemeral: true });
        }
    }
};

const commandModules = [BanCommand, unbanCommand, MuteCommand, UnmuteCommand];

const adminCommands = new Collection<string, Command>();

for (const command of commandModules) {
    adminCommands.set(command.data.name, command);
}

export default adminCommands;