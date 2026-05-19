import { BaseService } from './baseService';

class LocalTrabalhoService extends BaseService<any> {
  constructor() {
    super('locais_trabalho', { 
      searchColumn: 'nome', 
      defaultOrderBy: 'nome' 
    });
  }
}

export const localTrabalhoService = new LocalTrabalhoService();
