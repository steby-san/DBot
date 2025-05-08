import configManager from './configManager';

const CONFIG_NAME = 'codeblock';

// Lưu trữ trạng thái của tính năng cho từng server
const codeBlockConfigs = new Map<string, boolean>();

export const setCodeBlockConfig = (guildId: string, enabled: boolean) => {
    configManager.updateConfig(CONFIG_NAME, guildId, enabled);
};

export const getCodeBlockConfig = (guildId: string): boolean => {
    const configs = configManager.getConfig(CONFIG_NAME);
    return configs[guildId] ?? false;
};

export const removeCodeBlockConfig = (guildId: string) => {
    configManager.removeConfig(CONFIG_NAME, guildId);
}; 