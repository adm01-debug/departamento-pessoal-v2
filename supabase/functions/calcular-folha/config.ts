export const config = {
  name: 'calcular-folha',
  timeout: 30000,
  memory: 256,
  region: 'us-east-1',
};

export const rateLimits = {
  maxRequests: 100,
  windowMs: 60000,
};

export const validation = {
  requiredFields: [],
  maxPayloadSize: 1024 * 1024,
};
