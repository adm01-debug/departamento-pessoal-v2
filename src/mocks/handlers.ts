// src/mocks/handlers.ts - MSW v2 handlers
import { http, HttpResponse } from 'msw';
import { colaboradoresMock } from './colaboradores.mock';
import { feriasMock } from './ferias.mock';
import { folhaMock } from './folha.mock';
import { pontoMock } from './ponto.mock';

export const handlers = [
  // Colaboradores
  http.get('*/api/colaboradores', () => {
    return HttpResponse.json({ data: colaboradoresMock, total: colaboradoresMock.length });
  }),
  
  http.get('*/api/colaboradores/:id', ({ params }) => {
    const colaborador = colaboradoresMock.find(c => c.id === params.id);
    return colaborador 
      ? HttpResponse.json(colaborador) 
      : new HttpResponse(null, { status: 404 });
  }),
  
  // Férias
  http.get('*/api/ferias', () => {
    return HttpResponse.json(feriasMock);
  }),
  
  // Folha
  http.get('*/api/folha', () => {
    return HttpResponse.json(folhaMock);
  }),
  
  // Ponto
  http.get('*/api/ponto', () => {
    return HttpResponse.json(pontoMock);
  }),
  
  // Auth
  http.post('*/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    return HttpResponse.json({
      user: { id: '1', nome: 'Admin', email: body.email },
      token: 'mock-token'
    });
  }),
  
  http.post('*/api/auth/logout', () => {
    return HttpResponse.json({ success: true });
  }),
];
