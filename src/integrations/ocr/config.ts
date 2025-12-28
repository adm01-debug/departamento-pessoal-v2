// ocr Integration Configuration
export interface ocrConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
}

export const defaultConfig: ocrConfig = {
  enabled: false,
  apiKey: '',
  endpoint: '',
};

export const initialize = async (config: ocrConfig) => {
  console.log('Initializing ocr...');
  return { success: true };
};

export const validateConfig = (config: ocrConfig): boolean => {
  return config.enabled && !!config.apiKey;
};
