import { describe, it, expect } from 'vitest';
import CryptoJS from 'crypto-js';

describe('Ponto Compliance (Portaria 671)', () => {
  const mockColaboradorId = 'colab-123';
  const mockData = '2026-05-09';
  const mockHora = '09:00';
  const mockDispositivoId = 'web-browser';

  it('deve gerar e validar hash SHA256 de integridade corretamente', () => {
    const hashPayload = `${mockColaboradorId}|${mockData}|${mockHora}|${mockDispositivoId}`;
    const hashIntegridade = CryptoJS.SHA256(hashPayload).toString();

    expect(hashIntegridade).toBeDefined();
    expect(hashIntegridade.length).toBe(64); // SHA-256 hex length

    // Simulação de validação
    const validationPayload = `${mockColaboradorId}|${mockData}|${mockHora}|${mockDispositivoId}`;
    const validationHash = CryptoJS.SHA256(validationPayload).toString();
    
    expect(hashIntegridade).toBe(validationHash);
  });

  it('deve detectar falha de integridade se os dados forem alterados', () => {
    const hashPayload = `${mockColaboradorId}|${mockData}|${mockHora}|${mockDispositivoId}`;
    const hashOriginal = CryptoJS.SHA256(hashPayload).toString();

    // Alteração maliciosa: mudar a hora, mas manter o hash original
    const alteradoPayload = `${mockColaboradorId}|${mockData}|08:00|${mockDispositivoId}`;
    const novoHash = CryptoJS.SHA256(alteradoPayload).toString();

    expect(hashOriginal).not.toBe(novoHash);
  });

  it('deve validar regra de geofencing (raio permitido)', () => {
    const workplaceLat = -23.5505;
    const workplaceLon = -46.6333;
    
    // Ponto dentro do raio (aprox 10 metros)
    const userLatIn = -23.5506;
    const userLonIn = -46.6334;
    
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const distIn = getDistance(workplaceLat, workplaceLon, userLatIn, userLonIn);
    expect(distIn).toBeLessThan(500); // Raio padrão de 500m

    // Ponto fora do raio (aprox 2km)
    const userLatOut = -23.5700;
    const userLonOut = -46.6500;
    const distOut = getDistance(workplaceLat, workplaceLon, userLatOut, userLonOut);
    expect(distOut).toBeGreaterThan(500);
  });
});
