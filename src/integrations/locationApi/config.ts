// locationApi Integration Configuration
export interface locationApiConfig {
  enabled: boolean;
  apiKey?: string;
  endpoint?: string;
}

export const defaultConfig: locationApiConfig = {
  enabled: false,
  apiKey: '',
  endpoint: '',
};

export const initialize = async (config: locationApiConfig) => {
  console.log('Initializing locationApi...');
  return { success: true };
};

export const validateConfig = (config: locationApiConfig): boolean => {
  return config.enabled && !!config.apiKey;
};
