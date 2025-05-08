import fs from 'fs';
import path from 'path';

interface ConfigData {
  [key: string]: any;
}

class ConfigManager {
  private static instance: ConfigManager;
  private configs: Map<string, ConfigData>;
  private readonly configDir: string;

  private constructor() {
    this.configs = new Map();
    this.configDir = path.join(process.cwd(), 'data');
    
    // Tạo thư mục data nếu chưa tồn tại
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  private getConfigPath(configName: string): string {
    return path.join(this.configDir, `${configName}.json`);
  }

  public loadConfig(configName: string): ConfigData {
    const configPath = this.getConfigPath(configName);
    try {
      if (fs.existsSync(configPath)) {
        const data = fs.readFileSync(configPath, 'utf-8');
        const config = JSON.parse(data);
        this.configs.set(configName, config);
        return config;
      }
    } catch (error) {
      console.error(`Lỗi khi đọc file cấu hình ${configName}:`, error);
    }
    return {};
  }

  public saveConfig(configName: string, data: ConfigData): void {
    try {
      const configPath = this.getConfigPath(configName);
      fs.writeFileSync(configPath, JSON.stringify(data, null, 4));
      this.configs.set(configName, data);
    } catch (error) {
      console.error(`Lỗi khi lưu file cấu hình ${configName}:`, error);
    }
  }

  public getConfig(configName: string): ConfigData {
    if (!this.configs.has(configName)) {
      return this.loadConfig(configName);
    }
    return this.configs.get(configName) || {};
  }

  public updateConfig(configName: string, key: string, value: any): void {
    const config = this.getConfig(configName);
    config[key] = value;
    this.saveConfig(configName, config);
  }

  public removeConfig(configName: string, key: string): void {
    const config = this.getConfig(configName);
    delete config[key];
    this.saveConfig(configName, config);
  }

  public deleteConfig(configName: string): void {
    const configPath = this.getConfigPath(configName);
    try {
      if (fs.existsSync(configPath)) {
        fs.unlinkSync(configPath);
      }
      this.configs.delete(configName);
    } catch (error) {
      console.error(`Lỗi khi xóa file cấu hình ${configName}:`, error);
    }
  }
}

export default ConfigManager.getInstance(); 