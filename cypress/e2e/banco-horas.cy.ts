// V19-E2E-019: Testes E2E Banco de Horas
describe("Banco de Horas", () => {
  beforeEach(() => { cy.login(); cy.visit("/banco-horas"); });
  it("deve exibir saldos", () => { cy.get("[data-testid=saldos-list]").should("be.visible"); });
  it("deve registrar crédito", () => {
    cy.get("[data-testid=novo-lancamento-btn]").click();
    cy.get("[data-testid=tipo-select]").select("credito");
    cy.get("[data-testid=horas-input]").type("2");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve registrar débito", () => {
    cy.get("[data-testid=novo-lancamento-btn]").click();
    cy.get("[data-testid=tipo-select]").select("debito");
    cy.get("[data-testid=horas-input]").type("1");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
