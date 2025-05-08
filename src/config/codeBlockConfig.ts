// Lưu trữ trạng thái của tính năng cho từng server
const codeBlockConfigs = new Map<string, boolean>();

export const setCodeBlockConfig = (guildId: string, enabled: boolean) => {
    codeBlockConfigs.set(guildId, enabled);
};

export const getCodeBlockConfig = (guildId: string): boolean => {
    return codeBlockConfigs.get(guildId) ?? false;
}; 