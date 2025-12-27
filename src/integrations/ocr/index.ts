// ocr Integration
export interface ocrConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
}

export const ocrIntegration = {
  async process(data: Record<string, any>): Promise<any> {
    console.log('[ocr] Processing:', data);
    return { success: true, data };
  },

  async configure(config: ocrConfig): Promise<void> {
    console.log('[ocr] Configured');
  },

  async validate(): Promise<boolean> {
    return true;
  },
};

export default ocrIntegration;
