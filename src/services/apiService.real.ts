// V17.2-S110: ApiService Real
export const apiServiceReal = {
  async get(url: string, headers?: Record<string, string>) { const res = await fetch(url, { headers }); return res.json(); },
  async post(url: string, body: any, headers?: Record<string, string>) { const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); return res.json(); },
  async put(url: string, body: any, headers?: Record<string, string>) { const res = await fetch(url, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) }); return res.json(); },
  async delete(url: string, headers?: Record<string, string>) { const res = await fetch(url, { method: 'DELETE', headers }); return res.ok; }
}; export default apiServiceReal;
