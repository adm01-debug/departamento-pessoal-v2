/**
 * @fileoverview Setup global para testes Vitest
 * @version V8.1 - Melhorado por análise QA
 */
import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll, afterEach } from 'vitest';

// ============================================
// CONFIGURAÇÃO GLOBAL
// ============================================

// Silenciar console durante testes (exceto erros)
const originalConsole = { ...console };
beforeAll(() => {
  console.log = vi.fn();
  console.info = vi.fn();
  console.debug = vi.fn();
  console.warn = vi.fn();
});

afterAll(() => {
  console.log = originalConsole.log;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
  console.warn = originalConsole.warn;
});

// Limpar todos os mocks após cada teste
afterEach(() => {
  vi.clearAllMocks();
});

// ============================================
// MOCK: SUPABASE
// ============================================

const createMockQueryBuilder = () => ({
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  upsert: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  neq: vi.fn().mockReturnThis(),
  gt: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lt: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  like: vi.fn().mockReturnThis(),
  ilike: vi.fn().mockReturnThis(),
  is: vi.fn().mockReturnThis(),
  in: vi.fn().mockReturnThis(),
  contains: vi.fn().mockReturnThis(),
  containedBy: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
  then: vi.fn((resolve) => resolve({ data: [], error: null })),
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => createMockQueryBuilder()),
    auth: {
      getUser: vi.fn().mockResolvedValue({ 
        data: { user: { id: 'test-user-id', email: 'test@example.com' } }, 
        error: null 
      }),
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: { user: { id: 'test-user-id' } } }, 
        error: null 
      }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        download: vi.fn().mockResolvedValue({ data: new Blob(), error: null }),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: 'https://test.com/file.png' } })),
        remove: vi.fn().mockResolvedValue({ data: [], error: null }),
      })),
    },
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
  },
}));

// ============================================
// MOCK: REACT QUERY
// ============================================

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn().mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    }),
    useMutation: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      mutateAsync: vi.fn().mockResolvedValue({}),
      isPending: false,
      isError: false,
      error: null,
      reset: vi.fn(),
    }),
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn(),
      refetchQueries: vi.fn(),
      setQueryData: vi.fn(),
      getQueryData: vi.fn(),
    })),
  };
});

// ============================================
// MOCK: TOAST/SONNER
// ============================================

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
  Toaster: vi.fn(() => null),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: [],
  })),
}));

// ============================================
// MOCK: ROUTER
// ============================================

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
    useParams: vi.fn(() => ({})),
    useSearchParams: vi.fn(() => [new URLSearchParams(), vi.fn()]),
    Link: vi.fn(({ children, to }) => children),
  };
});

// ============================================
// MOCK: WINDOW/DOM
// ============================================

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock de sessionStorage
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });

// Mock de matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock de scrollTo
window.scrollTo = vi.fn();

// Mock de fetch
global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: vi.fn().mockResolvedValue({}),
  text: vi.fn().mockResolvedValue(''),
  blob: vi.fn().mockResolvedValue(new Blob()),
});

// ============================================
// UTILITÁRIOS DE TESTE
// ============================================

/**
 * Helper para criar mock de resposta Supabase
 */
export function mockSupabaseResponse<T>(data: T, error: any = null) {
  return { data, error };
}

/**
 * Helper para criar mock de usuário autenticado
 */
export function mockAuthenticatedUser(overrides = {}) {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Helper para criar mock de colaborador
 */
export function mockColaborador(overrides = {}) {
  return {
    id: 'test-colab-id',
    nome: 'João da Silva',
    cpf: '12345678900',
    email: 'joao@example.com',
    salario: 5000,
    data_admissao: '2020-01-01',
    status: 'ativo',
    empresa_id: 'test-empresa-id',
    ...overrides,
  };
}

/**
 * Helper para criar mock de empresa
 */
export function mockEmpresa(overrides = {}) {
  return {
    id: 'test-empresa-id',
    razao_social: 'Empresa Teste LTDA',
    cnpj: '12345678000100',
    ativa: true,
    ...overrides,
  };
}
