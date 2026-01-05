export interface DadosSensiveis { cpf?: string; nome?: string; email?: string; telefone?: string; endereco?: string; salario?: number; dataNascimento?: string; }
export function anonimizarCPF(cpf: string): string { return cpf.substring(0, 3) + ".***.***-" + cpf.substring(12); }
export function anonimizarNome(nome: string): string { const partes = nome.split(" "); if (partes.length === 1) return partes[0][0] + "***"; return partes[0] + " " + partes.slice(1).map(p => p[0] + ".").join(" "); }
export function anonimizarEmail(email: string): string { const [user, domain] = email.split("@"); return user.substring(0, 2) + "***@" + domain; }
export function anonimizarTelefone(tel: string): string { return tel.substring(0, 4) + "****" + tel.substring(tel.length - 2); }
export function anonimizarSalario(salario: number): string { const faixa = Math.floor(salario / 1000) * 1000; return `R$ ${faixa.toLocaleString()} - ${(faixa + 999).toLocaleString()}`; }
export function anonimizarDados(dados: DadosSensiveis): DadosSensiveis {
  return { cpf: dados.cpf ? anonimizarCPF(dados.cpf) : undefined, nome: dados.nome ? anonimizarNome(dados.nome) : undefined, email: dados.email ? anonimizarEmail(dados.email) : undefined, telefone: dados.telefone ? anonimizarTelefone(dados.telefone) : undefined, endereco: dados.endereco ? "Endereço ocultado" : undefined, salario: dados.salario ? undefined : undefined, dataNascimento: dados.dataNascimento ? dados.dataNascimento.substring(0, 4) + "-**-**" : undefined };
}
export function hashDados(dados: string): string { let hash = 0; for (let i = 0; i < dados.length; i++) { hash = ((hash << 5) - hash) + dados.charCodeAt(i); hash |= 0; } return Math.abs(hash).toString(16); }
export default anonimizarDados;
