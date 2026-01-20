// V20-012: Validador de Documentos Brasileiros
export const documentosBR = {
  validarCPF(cpf: string): boolean {
    const nums = cpf.replace(/\D/g, '');
    if (nums.length !== 11 || /^(\d)\1+$/.test(nums)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(nums[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(nums[9])) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(nums[10]);
  },

  validarCNPJ(cnpj: string): boolean {
    const nums = cnpj.replace(/\D/g, '');
    if (nums.length !== 14 || /^(\d)\1+$/.test(nums)) return false;
    
    const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let soma = 0;
    for (let i = 0; i < 12; i++) soma += parseInt(nums[i]) * pesos1[i];
    let resto = soma % 11;
    const dig1 = resto < 2 ? 0 : 11 - resto;
    if (dig1 !== parseInt(nums[12])) return false;
    
    soma = 0;
    for (let i = 0; i < 13; i++) soma += parseInt(nums[i]) * pesos2[i];
    resto = soma % 11;
    const dig2 = resto < 2 ? 0 : 11 - resto;
    return dig2 === parseInt(nums[13]);
  },

  validarPIS(pis: string): boolean {
    const nums = pis.replace(/\D/g, '');
    if (nums.length !== 11) return false;
    const pesos = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(nums[i]) * pesos[i];
    const resto = soma % 11;
    const dig = resto < 2 ? 0 : 11 - resto;
    return dig === parseInt(nums[10]);
  },

  formatarCPF(cpf: string): string {
    const nums = cpf.replace(/\D/g, '');
    return nums.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  },

  formatarCNPJ(cnpj: string): string {
    const nums = cnpj.replace(/\D/g, '');
    return nums.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  },

  formatarPIS(pis: string): string {
    const nums = pis.replace(/\D/g, '');
    return nums.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
  }
};

export default documentosBR;
