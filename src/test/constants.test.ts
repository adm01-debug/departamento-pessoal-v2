import { describe, it, expect } from 'vitest';
import * as constants from '@/lib/constants';

describe('constants', () => {
  it('deve estar definido', () => { expect(constants).toBeDefined(); });
  it('deve ter constantes de status', () => { 
    expect(constants.STATUS || constants.STATUSES || constants.statusOptions).toBeDefined(); 
  });
  it('deve ter constantes de roles', () => { 
    expect(constants.ROLES || constants.userRoles || constants.roles).toBeDefined(); 
  });
  it('deve ter constantes de limites', () => { 
    expect(constants.LIMITS || constants.MAX_VALUES || constants.limits).toBeDefined(); 
  });
});
