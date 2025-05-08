import configManager from './configManager';
import { Guild } from 'discord.js';

interface WelcomeConfig {
    channelId: string;
    message: string;
    roleId?: string;
}

const CONFIG_NAME = 'welcome';

export const setWelcomeConfig = (guildId: string, channelId: string, message: string, roleId?: string) => {
    const config = { channelId, message, roleId };
    configManager.saveConfig(CONFIG_NAME, { [guildId]: config });
};

export const getWelcomeConfig = (guildId: string): WelcomeConfig | undefined => {
    const configs = configManager.getConfig(CONFIG_NAME);
    return configs[guildId];
};

export const removeWelcomeConfig = (guildId: string) => {
    const configs = configManager.getConfig(CONFIG_NAME);
    delete configs[guildId];
    configManager.saveConfig(CONFIG_NAME, configs);
}; 