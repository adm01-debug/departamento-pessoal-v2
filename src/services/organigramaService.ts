import { supabase } from "@/integrations/supabase/client";

export interface NoOrganograma {
  id: string;
  empresa_id: string;
  colaborador_id?: string;
  cargo_id?: string;
  departamento_id?: string;
  parent_id?: string;
  nivel: number;
  ordem: number;
  tipo: "colaborador" | "cargo" | "departamento" | "area";
  nome: string;
  titulo?: string;
  foto_url?: string;
  email?: string;
  telefone?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

class OrganigramaService {
  private tableName = "organograma";

  async listar(filtros?: { empresa_id?: string; ativo?: boolean }): Promise<NoOrganograma[]> {
    let query = supabase.from(this.tableName).select("*");
    if (filtros?.empresa_id) query = query.eq("empresa_id", filtros.empresa_id);
    if (filtros?.ativo !== undefined) query = query.eq("ativo", filtros.ativo);
    const { data, error } = await query.order("nivel").order("ordem");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarPorId(id: string): Promise<NoOrganograma | null> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("id", id).single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async criar(no: Partial<NoOrganograma>): Promise<NoOrganograma> {
    const nivel = no.parent_id ? await this.calcularNivel(no.parent_id) : 0;
    const ordem = await this.proximaOrdem(no.parent_id);
    const { data, error } = await supabase.from(this.tableName).insert([{ ...no, nivel, ordem, ativo: true }]).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async atualizar(id: string, no: Partial<NoOrganograma>): Promise<NoOrganograma> {
    const { data, error } = await supabase.from(this.tableName).update({ ...no, updated_at: new Date().toISOString() }).eq("id", id).select().single();
    if (error) throw new Error(`Erro: ${error.message}`);
    return data;
  }

  async excluir(id: string): Promise<void> {
    const filhos = await this.buscarFilhos(id);
    if (filhos.length > 0) throw new Error("Não é possível excluir nó com subordinados");
    const { error } = await supabase.from(this.tableName).delete().eq("id", id);
    if (error) throw new Error(`Erro: ${error.message}`);
  }

  async buscarFilhos(parentId: string): Promise<NoOrganograma[]> {
    const { data, error } = await supabase.from(this.tableName).select("*").eq("parent_id", parentId).eq("ativo", true).order("ordem");
    if (error) throw new Error(`Erro: ${error.message}`);
    return data || [];
  }

  async buscarArvore(empresaId: string): Promise<NoOrganograma[]> {
    const todos = await this.listar({ empresa_id: empresaId, ativo: true });
    return this.construirArvore(todos);
  }

  private construirArvore(nos: NoOrganograma[], parentId?: string): NoOrganograma[] {
    return nos.filter(n => n.parent_id === parentId).map(n => ({ ...n, filhos: this.construirArvore(nos, n.id) }));
  }

  private async calcularNivel(parentId: string): Promise<number> {
    const parent = await this.buscarPorId(parentId);
    return parent ? parent.nivel + 1 : 0;
  }

  private async proximaOrdem(parentId?: string): Promise<number> {
    const { data } = await supabase.from(this.tableName).select("ordem").eq("parent_id", parentId || null).order("ordem", { ascending: false }).limit(1);
    return data && data.length > 0 ? data[0].ordem + 1 : 0;
  }

  async moverNo(id: string, novoParentId: string | null): Promise<NoOrganograma> {
    const novoNivel = novoParentId ? await this.calcularNivel(novoParentId) : 0;
    const novaOrdem = await this.proximaOrdem(novoParentId || undefined);
    return this.atualizar(id, { parent_id: novoParentId || undefined, nivel: novoNivel, ordem: novaOrdem });
  }

  async obterEstatisticas(empresaId: string): Promise<{ total_niveis: number; total_colaboradores: number; total_departamentos: number }> {
    const nos = await this.listar({ empresa_id: empresaId, ativo: true });
    return {
      total_niveis: Math.max(...nos.map(n => n.nivel), 0) + 1,
      total_colaboradores: nos.filter(n => n.tipo === "colaborador").length,
      total_departamentos: nos.filter(n => n.tipo === "departamento").length
    };
  }
}

export const organigramaService = new OrganigramaService();
export default organigramaService;
