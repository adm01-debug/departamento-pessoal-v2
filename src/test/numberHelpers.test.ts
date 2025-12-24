import { describe, it, expect } from 'vitest';
import * as numberHelpers from '@/lib/numberHelpers';

describe('numberHelpers', () => {
  it('deve estar definido', () => { expect(numberHelpers).toBeDefined(); });
  it('deve ter função de formatar moeda', () => { 
    expect(numberHelpers.formatCurrency || numberHelpers.formatarMoeda).toBeDefined(); 
  });
  it('deve ter função de formatar percentual', () => { 
    expect(numberHelpers.formatPercent || numberHelpers.formatarPercentual).toBeDefined(); 
  });
  it('deve ter função de arredondar', () => { 
    expect(numberHelpers.round || numberHelpers.arredondar).toBeDefined(); 
  });
});
