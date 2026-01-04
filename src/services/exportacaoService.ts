import { supabase } from "@/integrations/supabase/client";

export type ExportFormat = "csv" | "xlsx" | "pdf" | "json";
export interface ExportOptions { format: ExportFormat; columns?: string[]; filters?: Record<string, any>; fileName?: string; includeHeaders?: boolean; dateRange?: { start: string; end: string }; }
export interface ExportResult { success: boolean; fileName: string; size: number; downloadUrl?: string; error?: string; }

class ExportacaoService {
  async exportTable(table: string, options: ExportOptions): Promise<ExportResult> {
    try {
      let query = supabase.from(table).select(options.columns?.join(",") || "*");
      if (options.filters) Object.entries(options.filters).forEach(([k, v]) => { if (v) query = query.eq(k, v); });
      const { data, error } = await query;
      if (error) throw error;
      const fileName = options.fileName || `${table}_${new Date().toISOString().slice(0, 10)}.${options.format}`;
      const content = this.formatData(data || [], options);
      return { success: true, fileName, size: content.length };
    } catch (error) { return { success: false, fileName: "", size: 0, error: String(error) }; }
  }

  private formatData(data: any[], options: ExportOptions): string {
    if (options.format === "json") return JSON.stringify(data, null, 2);
    if (options.format === "csv") return this.toCSV(data, options.includeHeaders !== false);
    return JSON.stringify(data);
  }

  private toCSV(data: any[], includeHeaders: boolean): string {
    if (data.length === 0) return "";
    const headers = Object.keys(data[0]);
    const rows = data.map(row => headers.map(h => `"${String(row[h] ?? "").replace(/"/g, '""')}"`).join(","));
    return includeHeaders ? [headers.join(","), ...rows].join("\n") : rows.join("\n");
  }

  async exportColaboradores(options: Partial<ExportOptions> = {}): Promise<ExportResult> {
    return this.exportTable("colaboradores", { format: "csv", ...options });
  }

  async exportFolhaPagamento(competencia: string, options: Partial<ExportOptions> = {}): Promise<ExportResult> {
    return this.exportTable("folha_pagamento", { format: "xlsx", filters: { competencia }, ...options });
  }

  async exportFerias(options: Partial<ExportOptions> = {}): Promise<ExportResult> {
    return this.exportTable("ferias", { format: "csv", ...options });
  }

  async exportPontos(options: Partial<ExportOptions> = {}): Promise<ExportResult> {
    return this.exportTable("registros_ponto", { format: "csv", ...options });
  }

  createDownloadLink(content: string, fileName: string, mimeType: string): string {
    const blob = new Blob([content], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  downloadFile(content: string, fileName: string, mimeType: string): void {
    const url = this.createDownloadLink(content, fileName, mimeType);
    const a = document.createElement("a");
    a.href = url; a.download = fileName; a.click();
    URL.revokeObjectURL(url);
  }
}

export const exportacaoService = new ExportacaoService();
export default exportacaoService;
