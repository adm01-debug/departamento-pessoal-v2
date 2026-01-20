// V18-E2E-002: Testes E2E Colaboradores
describe("Colaboradores", () => {
  beforeEach(() => { cy.login(); cy.visit("/colaboradores"); });
  it("deve carregar lista", () => { cy.get("table").should("be.visible"); });
  it("deve abrir modal novo", () => { cy.contains("Novo").click(); cy.get("[role='dialog']").should("be.visible"); });
  it("deve filtrar", () => { cy.get("input[placeholder*='Buscar']").type("Maria"); });
});
