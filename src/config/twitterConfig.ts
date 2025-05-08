// Lưu trữ trạng thái của tính năng cho từng server
const twitterConfigs = new Map<string, boolean>();

export const setTwitterConfig = (guildId: string, enabled: boolean) => {
  twitterConfigs.set(guildId, enabled);
};

export const getTwitterConfig = (guildId: string): boolean => {
  return twitterConfigs.get(guildId) ?? true; // Mặc định là bật
};

export const removeTwitterConfig = (guildId: string) => {
  twitterConfigs.delete(guildId);
}; 