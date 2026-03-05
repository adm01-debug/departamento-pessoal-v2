// @ts-nocheck
export function gerarRelatorioColaboradores(colaboradores: any[]): string {
  let html = '<h1>Relatório de Colaboradores</h1><table><thead><tr><th>Nome</th><th>CPF</th><th>Cargo</th><th>Admissão</th><th>Status</th></tr></thead><tbody>';
  colaboradores.forEach(c => { html += `<tr><td>${c.nome || c.nome_completo}</td><td>${c.cpf}</td><td>${c.cargo || '-'}</td><td>${c.data_admissao || c.dataAdmissao}</td><td>${c.status}</td></tr>`; });
  html += '</tbody></table>';
  return html;
}
export function gerarRelatorioFolha(folha: any[], competencia: string): string {
  let html = `<h1>Folha de Pagamento - ${competencia}</h1><table><thead><tr><th>Colaborador</th><th>Salário Base</th><th>Proventos</th><th>Descontos</th><th>Líquido</th></tr></thead><tbody>`;
  let totalLiquido = 0;
  folha.forEach(f => { html += `<tr><td>${f.colaboradorId || f.colaborador_id}</td><td>${f.salarioBase || f.salario_base}</td><td>${f.totalProventos || f.total_proventos}</td><td>${f.totalDescontos || f.total_descontos}</td><td>${f.salarioLiquido || f.liquido}</td></tr>`; totalLiquido += (f.salarioLiquido || f.liquido || 0); });
  html += `</tbody><tfoot><tr><td colspan="4">Total</td><td>${totalLiquido}</td></tr></tfoot></table>`;
  return html;
}
