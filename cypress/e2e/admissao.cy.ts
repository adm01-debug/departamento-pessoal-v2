// V18-E2E-003: Testes E2E Admissão
describe("Admissão", () => {
  beforeEach(() => { cy.login(); cy.visit("/admissao"); });
  it("deve exibir wizard de admissão", () => { cy.get("[data-testid=admissao-wizard]").should("be.visible"); });
  it("deve preencher dados pessoais", () => {
    cy.get("[data-testid=nome-input]").type("Maria Santos");
    cy.get("[data-testid=cpf-input]").type("98765432100");
    cy.get("[data-testid=proximo-btn]").click();
    cy.get("[data-testid=step-2]").should("be.visible");
  });
  it("deve concluir admissão", () => {
    cy.preencherDadosAdmissao();
    cy.get("[data-testid=concluir-btn]").click();
    cy.get("[data-testid=success-toast]").should("contain", "Admissão realizada");
  });
});
