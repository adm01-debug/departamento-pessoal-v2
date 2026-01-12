// V17.2-T020: Types de API
export interface ApiResponse<T> { success: boolean; data?: T; error?: ApiError; meta?: ApiMeta; }
export interface ApiError { code: string; message: string; details?: any; }
export interface ApiMeta { total?: number; pagina?: number; por_pagina?: number; total_paginas?: number; }
export interface PaginacaoParams { pagina?: number; por_pagina?: number; ordenar_por?: string; direcao?: 'asc' | 'desc'; }
export interface FiltroParams { busca?: string; status?: string; data_inicio?: string; data_fim?: string; [key: string]: any; }
export interface QueryParams extends PaginacaoParams, FiltroParams {}
