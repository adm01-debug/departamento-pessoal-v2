// V19-E2E-009: Testes E2E Benefícios
describe("Benefícios", () => {
  beforeEach(() => { cy.login(); cy.visit("/beneficios"); });
  it("deve exibir lista de benefícios", () => { cy.get("[data-testid=beneficios-list]").should("be.visible"); });
  it("deve cadastrar novo benefício", () => {
    cy.get("[data-testid=novo-beneficio-btn]").click();
    cy.get("[data-testid=tipo-beneficio]").select("vale_alimentacao");
    cy.get("[data-testid=valor-input]").type("500");
    cy.get("[data-testid=salvar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve associar benefício a colaborador", () => {
    cy.get("[data-testid=associar-btn]").first().click();
    cy.get("[data-testid=colaborador-select]").select("João Silva");
    cy.get("[data-testid=confirmar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
