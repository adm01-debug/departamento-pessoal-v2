import { describe, it, expect } from "vitest";
import { anonimizacao } from "./anonimizacao";
describe("anonimizacao", () => {
  it("anonimiza CPF corretamente", () => {
    const result = anonimizacao.anonimizarCPF("12345678901");
    expect(result).toBe("***.***.***-01");
  });
  it("anonimiza nome corretamente", () => {
    const result = anonimizacao.anonimizarNome("João Silva Santos");
    expect(result).toBe("João S. S.");
  });
  it("anonimiza email corretamente", () => {
    const result = anonimizacao.anonimizarEmail("joao.silva@empresa.com");
    expect(result).toContain("***@");
    expect(result).toContain("empresa.com");
  });
  it("anonimiza salário em faixas", () => {
    const result = anonimizacao.anonimizarSalario(5500);
    expect(result).toBe("R$ 5.000 - R$ 6.000");
  });
});
