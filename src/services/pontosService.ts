import { pontoService } from './pontoService';
import { batidasPontoService } from './batidasPontoService';
import { pontoMonitorService } from './pontoMonitorService';
import { pontoAuditService } from './pontoAuditService';
import { pontoOfflineService } from './pontoOfflineService';

/**
 * Facade service for Point/Attendance module
 * Consolidates multiple internal services for easier access
 */
export const pontosService = {
  // Registration and Core
  registrar: pontoService.registrar.bind(pontoService),
  getSettings: pontoService.getSettings.bind(pontoService),
  buscarRegistroHoje: pontoService.buscarRegistroHoje.bind(pontoService),
  buscarRegistrosSemana: pontoService.buscarRegistrosSemana.bind(pontoService),

  // Management and Listing
  listar: batidasPontoService.listar.bind(batidasPontoService),
  listarPorData: batidasPontoService.listarPorData.bind(batidasPontoService),
  ajustar: batidasPontoService.ajustar.bind(batidasPontoService),
  excluir: batidasPontoService.excluir.bind(batidasPontoService),
  fecharPeriodo: batidasPontoService.fecharPeriodo.bind(batidasPontoService),

  // Monitoring and Audit
  monitor: pontoMonitorService,
  audit: pontoAuditService,
  
  // Offline support
  offline: pontoOfflineService
};
