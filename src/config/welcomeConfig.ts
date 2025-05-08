interface WelcomeConfig {
  channelId: string;
  message: string;
}

const welcomeConfigs = new Map<string, WelcomeConfig>();

export const setWelcomeConfig = (guildId: string, channelId: string, message: string) => {
  welcomeConfigs.set(guildId, { channelId, message });
};

export const getWelcomeConfig = (guildId: string): WelcomeConfig | undefined => {
  return welcomeConfigs.get(guildId);
};

export const removeWelcomeConfig = (guildId: string) => {
  welcomeConfigs.delete(guildId);
}; 