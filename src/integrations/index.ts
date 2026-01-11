// V15-113: src/integrations/index.ts
// Barrel exports para todas as integrações

// Banking
export * from './banking';
export * from './pix';
export * from './boleto';
export * from './cnab';

// Government
export * from './esocial';
export * from './government';
export * from './lgpdCompliance';

// Communication
export * from './email';
export * from './sms';
export * from './whatsapp';
export * from './slack';
export * from './microsoftTeams';
export * from './pushNotifications';

// Calendar
export * from './googleCalendar';

// OCR & Documents
export * from './ocr';
export * from './nfse';
export * from './certificadoDigital';

// Face Recognition
export * from './faceRecognition';

// ERP & Accounting
export * from './erp';
export * from './contabilidade';

// Payment Gateways
export * from './payments';
export * from './asaas';

// Supabase
export * from './supabase';

// Location
export * from './locationApi';

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
