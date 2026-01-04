import { supabase } from "@/integrations/supabase/client";

export interface ImportOptions { table: string; mapping?: Record<string, string>; skipDuplicates?: boolean; validateOnly?: boolean; batchSize?: number; }
export interface ImportResult { success: boolean; imported: number; skipped: number; errors: { row: number; error: string }[]; }
export interface ImportValidation { valid: boolean; errors: string[]; warnings: string[]; rowCount: number; }

class ImportacaoService {
  async importCSV(content: string, options: ImportOptions): Promise<ImportResult> {
    const lines = content.split("\n").filter(l => l.trim());
    if (lines.length < 2) return { success: false, imported: 0, skipped: 0, errors: [{ row: 0, error: "Arquivo vazio" }] };
    
    const headers = lines[0].split(",").map(h => h.trim().replace(/"/g, ""));
    const mappedHeaders = headers.map(h => options.mapping?.[h] || h);
    const errors: { row: number; error: string }[] = [];
    let imported = 0, skipped = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = this.parseCSVLine(lines[i]);
        const row: Record<string, any> = {};
        mappedHeaders.forEach((h, idx) => { if (values[idx] !== undefined) row[h] = values[idx]; });
        
        if (!options.validateOnly) {
          const { error } = await supabase.from(options.table).insert([row]);
          if (error) { if (options.skipDuplicates && error.code === "23505") { skipped++; } else { errors.push({ row: i, error: error.message }); } }
          else { imported++; }
        } else { imported++; }
      } catch (e) { errors.push({ row: i, error: String(e) }); }
    }
    return { success: errors.length === 0, imported, skipped, errors };
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "", inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; }
      else if (char === "," && !inQuotes) { result.push(current.trim()); current = ""; }
      else { current += char; }
    }
    result.push(current.trim());
    return result;
  }

  async validateCSV(content: string, options: ImportOptions): Promise<ImportValidation> {
    const lines = content.split("\n").filter(l => l.trim());
    const errors: string[] = [], warnings: string[] = [];
    if (lines.length < 2) errors.push("Arquivo vazio ou sem dados");
    const headers = lines[0]?.split(",").map(h => h.trim().replace(/"/g, "")) || [];
    if (headers.length === 0) errors.push("Cabeçalhos não encontrados");
    return { valid: errors.length === 0, errors, warnings, rowCount: Math.max(0, lines.length - 1) };
  }

  async importColaboradores(content: string, options: Partial<ImportOptions> = {}): Promise<ImportResult> {
    return this.importCSV(content, { table: "colaboradores", mapping: { "Nome": "nome", "CPF": "cpf", "Email": "email", "Data Admissão": "data_admissao" }, ...options });
  }

  generateTemplate(table: string): string {
    const templates: Record<string, string[]> = {
      colaboradores: ["nome", "cpf", "email", "telefone", "data_nascimento", "data_admissao", "salario"],
      departamentos: ["nome", "descricao", "gerente_id"],
      cargos: ["nome", "descricao", "nivel", "salario_base"],
    };
    return (templates[table] || ["id", "nome"]).join(",") + "\n";
  }
}

export const importacaoService = new ImportacaoService();
export default importacaoService;
