// whatsapp Integration Configuration
export interface whatsappConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
}

export const defaultConfig: whatsappConfig = {
  enabled: false,
  apiKey: '',
  endpoint: '',
};

export const initialize = async (config: whatsappConfig) => {
  console.log('Initializing whatsapp...');
  return { success: true };
};

export const validateConfig = (config: whatsappConfig): boolean => {
  return config.enabled && !!config.apiKey;
};
