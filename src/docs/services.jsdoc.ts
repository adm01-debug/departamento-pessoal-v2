/**
 * @fileoverview Documentação JSDoc para todos os services do sistema
 * @module services
 */

/**
 * Service para gerenciamento de admissões
 * @namespace admissoesService
 * @property {Function} getAll - Retorna todas as admissões
 * @property {Function} getById - Retorna admissão por ID
 * @property {Function} create - Cria nova admissão
 * @property {Function} update - Atualiza admissão existente
 * @property {Function} delete - Remove admissão
 */

/**
 * Service para gerenciamento de desligamentos
 * @namespace desligamentosService
 * @property {Function} getAll - Retorna todos os desligamentos
 * @property {Function} getById - Retorna desligamento por ID
 * @property {Function} create - Cria novo desligamento
 * @property {Function} calcularRescisao - Calcula valores rescisórios
 */

/**
 * Service para configurações do sistema
 * @namespace configuracoesService
 * @property {Function} get - Retorna configurações atuais
 * @property {Function} update - Atualiza configurações
 */

/**
 * Service para backup e restore
 * @namespace backupService
 * @property {Function} getAll - Lista todos os backups
 * @property {Function} create - Cria novo backup
 * @property {Function} restore - Restaura backup
 * @property {Function} delete - Remove backup
 */

/**
 * Service para integrações externas
 * @namespace integracoesService
 * @property {Function} getAll - Lista todas as integrações
 * @property {Function} sync - Sincroniza integração
 * @property {Function} getLogs - Retorna logs de integração
 */

/**
 * Service para onboarding de colaboradores
 * @namespace onboardingService
 * @property {Function} getByColaborador - Retorna onboarding do colaborador
 * @property {Function} create - Cria novo onboarding
 * @property {Function} updateStep - Atualiza etapa
 * @property {Function} complete - Finaliza onboarding
 */

/**
 * Service para contratação digital
 * @namespace contratacaoService
 * @property {Function} gerarContrato - Gera contrato digital
 * @property {Function} enviarParaAssinatura - Envia para assinatura
 */

/**
 * Service para assinaturas digitais
 * @namespace assinaturasService
 * @property {Function} getByDocumento - Retorna assinaturas do documento
 * @property {Function} create - Cria nova assinatura
 * @property {Function} validar - Valida assinatura
 */

/**
 * Service para organograma
 * @namespace organogramaService
 * @property {Function} getTree - Retorna árvore hierárquica
 * @property {Function} updateGestor - Atualiza gestor do colaborador
 */

export {};
