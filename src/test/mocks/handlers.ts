// V15-358
import { http, HttpResponse } from 'msw';
export const handlers = [
  http.get('/api/colaboradores', () => HttpResponse.json([{ id: '1', nome: 'João Silva', cpf: '12345678900', status: 'ativo' }])),
  http.get('/api/empresas', () => HttpResponse.json([{ id: '1', razao_social: 'Empresa Teste', cnpj: '12345678000190' }])),
  http.post('/api/auth/login', async ({ request }) => { const { email } = await request.json() as any; return HttpResponse.json({ token: 'fake-token', user: { id: '1', email } }); }),
];
