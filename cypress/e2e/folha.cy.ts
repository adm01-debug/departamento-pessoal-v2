// V18-E2E-004: Testes E2E Folha de Pagamento
describe("Folha de Pagamento", () => {
  beforeEach(() => { cy.login(); cy.visit("/folha"); });
  it("deve listar competências", () => { cy.get("[data-testid=competencias-list]").should("be.visible"); });
  it("deve criar nova folha", () => {
    cy.get("[data-testid=nova-folha-btn]").click();
    cy.get("[data-testid=competencia-select]").select("2026-01");
    cy.get("[data-testid=criar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve processar folha", () => {
    cy.get("[data-testid=processar-btn]").first().click();
    cy.get("[data-testid=confirmar-btn]").click();
    cy.get("[data-testid=status]").should("contain", "Processada");
  });
});
