// =====================================================
// CLIENTE BITRIX24
// =====================================================

export interface Bitrix24User {
  ID: number;
  NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  PERSONAL_PHONE?: string;
  WORK_PHONE?: string;
  WORK_POSITION?: string;
  UF_DEPARTMENT?: number[];
  ACTIVE?: boolean;
}

export interface Bitrix24Department {
  ID: number;
  NAME: string;
  PARENT?: number;
  SORT?: number;
}

export interface Bitrix24TestResult {
  success: boolean;
  error?: string;
  serverTime?: string;
}

export class Bitrix24Client {
  private webhookUrl: string;

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async request<T>(method: string, params?: Record<string, any>): Promise<T> {
    const url = `${this.webhookUrl}/${method}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: params ? JSON.stringify(params) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error_description || data.error);
      }

      return data.result;
    } catch (error) {
      console.error(`Bitrix24 API error (${method}):`, error);
      throw error;
    }
  }

  /**
   * Testa a conexão com o webhook
   */
  async testConnection(): Promise<Bitrix24TestResult> {
    try {
      const result = await this.request<{ TIME: string }>('server.time');
      return {
        success: true,
        serverTime: result?.TIME,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  /**
   * Busca todos os usuários
   */
  async getUsers(active: boolean = true): Promise<Bitrix24User[]> {
    const users: Bitrix24User[] = [];
    let start = 0;
    
    while (true) {
      const batch = await this.request<Bitrix24User[]>('user.get', {
        filter: active ? { ACTIVE: true } : {},
        start,
      });
      
      if (!batch || batch.length === 0) break;
      
      users.push(...batch);
      
      if (batch.length < 50) break;
      start += 50;
    }

    return users;
  }

  /**
   * Busca um usuário por ID
   */
  async getUser(userId: number | string): Promise<Bitrix24User | null> {
    const users = await this.request<Bitrix24User[]>('user.get', {
      ID: userId,
    });
    return users?.[0] || null;
  }

  /**
   * Atualiza um usuário
   */
  async updateUser(userId: number | string, data: Partial<Bitrix24User>): Promise<boolean> {
    const result = await this.request<boolean>('user.update', {
      ID: userId,
      ...data,
    });
    return result;
  }

  /**
   * Busca todos os departamentos
   */
  async getDepartments(): Promise<Bitrix24Department[]> {
    const departments = await this.request<Bitrix24Department[]>('department.get', {});
    return departments || [];
  }

  /**
   * Busca departamento por ID
   */
  async getDepartment(departmentId: number): Promise<Bitrix24Department | null> {
    const departments = await this.request<Bitrix24Department[]>('department.get', {
      ID: departmentId,
    });
    return departments?.[0] || null;
  }
}

// Singleton para uso global (se webhook configurado)
export const bitrix24 = {
  createClient: (webhookUrl: string) => new Bitrix24Client(webhookUrl),
};

export default Bitrix24Client;

