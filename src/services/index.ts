// V18-FIX: Services Index - CORRIGIDO para usar services REAIS
// Atualizado em 16/01/2026
// IMPORTANTE: Este arquivo foi corrigido para exportar implementações REAIS
// ao invés de stubs vazios

// ==============================================================================
// SERVICES COM SUPABASE (Production Ready)
// ==============================================================================

// Colaborador - CRUD completo com Supabase
export { colaboradorServiceReal as colaboradorService } from "./colaboradorService";
export { colaboradorServiceReal } from "./colaboradorService";
export type { ColaboradorFilters, ColaboradorWithRelations } from "./colaboradorService";

// Férias - CRUD completo com Supabase
export { feriasServiceReal as feriasService } from "./feriasService";
export { feriasServiceReal } from "./feriasService";

// Folha de Pagamento - CRUD completo com Supabase
export { folhaServiceReal as folhaService } from "./folhaService";
export { folhaServiceReal } from "./folhaService";

// Auth e Empresa
export { authService } from "./authService";
export { empresaService } from "./empresaService";

// ==============================================================================
// OUTROS SERVICES REAIS
// ==============================================================================
export { default as admissaoService } from "./admissaoService";
export { default as afastamentoService } from "./afastamentoService";
export { default as pontoService } from "./pontoService";
export { default as beneficioService } from "./beneficioService";
export { default as relatorioService } from "./relatorioService";
export { default as bancoHorasService } from "./bancoHorasService";
export { default as cargoService } from "./cargoService";
export { default as departamentoService } from "./departamentoService";
export { default as dependenteService } from "./dependenteService";
export { default as documentoService } from "./documentoService";
export { default as esocialService } from "./esocialService";
export { default as rescisaoService } from "./rescisaoService";
export { default as rubricaService } from "./rubricaService";
export { default as notificacaoService } from "./notificacaoService";
export { default as usuarioService } from "./usuarioService";
export { default as backupService } from "./backupService";
export { default as configService } from "./configService";

// Dashboard - usa API tradicional
export { dashboardService } from "./dashboardService";

// Audit
export { default as auditService } from "./auditService";
