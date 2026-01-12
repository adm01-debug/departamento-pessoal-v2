// V19-E2E-004: Testes E2E Demissão
describe("Demissão", () => {
  beforeEach(() => { cy.login(); cy.visit("/demissao"); });
  it("deve exibir lista de demissões", () => { cy.get("[data-testid=demissoes-list]").should("be.visible"); });
  it("deve abrir formulário de nova demissão", () => {
    cy.get("[data-testid=nova-demissao-btn]").click();
    cy.get("[data-testid=demissao-form]").should("be.visible");
  });
  it("deve calcular verbas rescisórias", () => {
    cy.get("[data-testid=nova-demissao-btn]").click();
    cy.get("[data-testid=colaborador-select]").select("João Silva");
    cy.get("[data-testid=tipo-demissao]").select("sem_justa_causa");
    cy.get("[data-testid=calcular-btn]").click();
    cy.get("[data-testid=verbas-resultado]").should("be.visible");
  });
  it("deve processar demissão completa", () => {
    cy.get("[data-testid=nova-demissao-btn]").click();
    cy.get("[data-testid=colaborador-select]").select("João Silva");
    cy.get("[data-testid=data-demissao]").type("2026-01-15");
    cy.get("[data-testid=tipo-demissao]").select("sem_justa_causa");
    cy.get("[data-testid=processar-btn]").click();
    cy.get("[data-testid=success-toast]").should("be.visible");
  });
});
