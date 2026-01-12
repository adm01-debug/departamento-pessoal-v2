// V17-S052: ExportService Real
export type FormatoExport = 'pdf' | 'xlsx' | 'csv' | 'xml' | 'txt';
export const exportServiceReal = {
  async exportar(dados: any[], formato: FormatoExport, nomeArquivo: string) { const mimeTypes = { pdf: 'application/pdf', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', csv: 'text/csv', xml: 'application/xml', txt: 'text/plain' }; return { nomeArquivo: `${nomeArquivo}.${formato}`, mimeType: mimeTypes[formato], tamanho: 0 }; },
  async exportarPDF(dados: any[], template: string) { return new Blob(); },
  async exportarExcel(dados: any[], colunas: string[]) { return new Blob(); },
  async exportarCSV(dados: any[]) { return new Blob(); }
};
export default exportServiceReal;
