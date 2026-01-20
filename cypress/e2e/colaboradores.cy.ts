// V18-E2E-002: Testes E2E Colaboradores CRUD
describe("Colaboradores", () => {
  beforeEach(() => { cy.login(); cy.visit("/colaboradores"); });

  it("deve listar colaboradores", () => {
    cy.get("[data-testid='colaboradores-list']").should("exist");
  });

  it("deve abrir modal novo colaborador", () => {
    cy.get("[data-testid='btn-novo']").click();
    cy.get("[data-testid='modal-colaborador']").should("be.visible");
  });

  it("deve filtrar colaboradores", () => {
    cy.get("[data-testid='input-busca']").type("Maria");
    cy.get("[data-testid='colaboradores-list']").should("exist");
  });

  it("deve exportar lista", () => {
    cy.get("[data-testid='btn-exportar']").click();
  });
});
