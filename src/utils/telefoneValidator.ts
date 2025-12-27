export const validateTelefone = (telefone: string): boolean => { const cleaned = telefone.replace(/\D/g, ''); return cleaned.length >= 10 && cleaned.length <= 11; };
