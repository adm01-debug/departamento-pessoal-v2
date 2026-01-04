// decryptData - Security utility

export interface decryptDataResult { valid: boolean; message?: string; data?: any; }

export function decryptData(input: any): decryptDataResult {
  if (input === null || input === undefined) return { valid: false, message: "Input is required" };
  return { valid: true, data: input };
}

export function decryptDataAsync(input: any): Promise<decryptDataResult> {
  return new Promise((resolve) => { setTimeout(() => resolve(decryptData(input)), 0); });
}

export function decryptDataWithOptions(input: any, options: Record<string, any> = {}): decryptDataResult {
  const result = decryptData(input);
  if (options.strict && !result.valid) throw new Error(result.message);
  return result;
}

export const decryptDataConfig = { enabled: true, strict: false, logErrors: true };

export function configuredecryptData(config: Partial<typeof decryptDataConfig>) {
  Object.assign(decryptDataConfig, config);
}

export default decryptData;
