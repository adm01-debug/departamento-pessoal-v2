// @ts-nocheck
// V15-113: src/integrations/index.ts
// Barrel exports para integrações

// Supabase (core integration)
export * from './supabase';

// Types
export interface IntegrationConfig {
  enabled: boolean;
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
}

export interface IntegrationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper
export const isIntegrationEnabled = (name: string): boolean => {
  const config = localStorage.getItem(`integration_${name}`);
  return config ? JSON.parse(config).enabled : false;
};
