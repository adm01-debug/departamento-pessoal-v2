// V18-E2E-001: Testes E2E Autenticação
describe("Autenticação", () => {
  beforeEach(() => { cy.visit("/login"); });
  it("deve exibir página de login", () => { cy.get("[data-testid=login-form]").should("be.visible"); });
  it("deve fazer login com credenciais válidas", () => {
    cy.get("[data-testid=email-input]").type("admin@test.com");
    cy.get("[data-testid=password-input]").type("123456");
    cy.get("[data-testid=login-button]").click();
    cy.url().should("include", "/dashboard");
  });
  it("deve mostrar erro com credenciais inválidas", () => {
    cy.get("[data-testid=email-input]").type("wrong@test.com");
    cy.get("[data-testid=password-input]").type("wrong");
    cy.get("[data-testid=login-button]").click();
    cy.get("[data-testid=error-message]").should("be.visible");
  });
  it("deve fazer logout", () => {
    cy.login();
    cy.get("[data-testid=logout-button]").click();
    cy.url().should("include", "/login");
  });
});
