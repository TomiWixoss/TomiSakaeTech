export interface UploadConfig {
  maxUploadsPerMinute: number;
  maxUploadsPerHour: number;
  maxFileSize: number;
  cooldownAfterLimit: number;
  blockedExtensions: string[];
}

export const adminService = {
  async getConfig(): Promise<UploadConfig> {
    const response = await fetch("/api/shared/admin/config");
    if (!response.ok) throw new Error("Failed to fetch config");
    return response.json();
  },

  async saveConfig(password: string, config: UploadConfig): Promise<{ success: boolean; error?: string }> {
    const response = await fetch("/api/shared/admin/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, config }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || "Failed to save config" };
    }
    
    return { success: true };
  },

  async verifyPassword(password: string): Promise<boolean> {
    try {
      const config = await this.getConfig();
      const result = await this.saveConfig(password, config);
      return result.success;
    } catch {
      return false;
    }
  },
};
