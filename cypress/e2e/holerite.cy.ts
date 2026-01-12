// V19-E2E-007: Testes E2E Holerite
describe("Holerite", () => {
  beforeEach(() => { cy.login(); cy.visit("/holerite"); });
  it("deve exibir lista de holerites", () => { cy.get("[data-testid=holerites-list]").should("be.visible"); });
  it("deve filtrar por competência", () => {
    cy.get("[data-testid=competencia-filter]").select("2026-01");
    cy.get("[data-testid=holerites-list]").should("be.visible");
  });
  it("deve visualizar holerite", () => {
    cy.get("[data-testid=ver-holerite-btn]").first().click();
    cy.get("[data-testid=holerite-viewer]").should("be.visible");
  });
  it("deve fazer download PDF", () => {
    cy.get("[data-testid=download-pdf-btn]").first().click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve enviar por email", () => {
    cy.get("[data-testid=enviar-email-btn]").first().click();
    cy.get("[data-testid=email-modal]").should("be.visible");
    cy.get("[data-testid=confirmar-envio]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
