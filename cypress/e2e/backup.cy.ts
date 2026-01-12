// V19-E2E-012: Testes E2E Backup
describe("Backup", () => {
  beforeEach(() => { cy.login(); cy.visit("/backup"); });
  it("deve exibir página de backup", () => { cy.get("[data-testid=backup-page]").should("be.visible"); });
  it("deve criar backup", () => {
    cy.get("[data-testid=criar-backup-btn]").click();
    cy.get("[data-testid=confirmar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
  it("deve listar backups", () => { cy.get("[data-testid=backups-list]").should("be.visible"); });
  it("deve restaurar backup", () => {
    cy.get("[data-testid=restaurar-btn]").first().click();
    cy.get("[data-testid=confirmar-restauracao]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
