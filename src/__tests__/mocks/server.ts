// V15-088: src/__tests__/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

export const setupTestServer = () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
};

export const addHandler = (handler: any) => {
  server.use(handler);
};

export const resetHandlers = () => {
  server.resetHandlers();
};
