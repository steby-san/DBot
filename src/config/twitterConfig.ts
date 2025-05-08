import configManager from './configManager';

const CONFIG_NAME = 'twitter';

// Lưu trữ trạng thái của tính năng cho từng server
const twitterConfigs = new Map<string, boolean>();

export const setTwitterConfig = (guildId: string, enabled: boolean) => {
    configManager.updateConfig(CONFIG_NAME, guildId, enabled);
};

export const getTwitterConfig = (guildId: string): boolean => {
    const configs = configManager.getConfig(CONFIG_NAME);
    return configs[guildId] ?? true; // Mặc định là bật
};

export const removeTwitterConfig = (guildId: string) => {
    configManager.removeConfig(CONFIG_NAME, guildId);
}; 