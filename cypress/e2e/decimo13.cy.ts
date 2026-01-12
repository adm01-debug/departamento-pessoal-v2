// V19-E2E-018: Testes E2E Décimo Terceiro
describe("Décimo Terceiro", () => {
  beforeEach(() => { cy.login(); cy.visit("/decimo13"); });
  it("deve exibir página 13º", () => { cy.get("[data-testid=decimo13-page]").should("be.visible"); });
  it("deve calcular 1ª parcela", () => {
    cy.get("[data-testid=calcular-primeira-btn]").click();
    cy.get("[data-testid=resultado-calculo]").should("be.visible");
  });
  it("deve calcular 2ª parcela", () => {
    cy.get("[data-testid=calcular-segunda-btn]").click();
    cy.get("[data-testid=resultado-calculo]").should("be.visible");
  });
  it("deve processar pagamento", () => {
    cy.get("[data-testid=processar-btn]").click();
    cy.get("[data-testid=confirmar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
