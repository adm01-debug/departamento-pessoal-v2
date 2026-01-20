// V18-E2E-001: Testes E2E Autenticacao
describe("Autenticacao", () => {
  beforeEach(() => { cy.visit("/login"); });

  it("deve exibir pagina de login", () => {
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="password"]').should("be.visible");
    cy.get('button[type="submit"]').should("be.visible");
  });

  it("deve mostrar erro com credenciais invalidas", () => {
    cy.get('input[name="email"]').type("invalido@teste.com");
    cy.get('input[name="password"]').type("senhaerrada");
    cy.get('button[type="submit"]').click();
    cy.contains("Credenciais inválidas").should("be.visible");
  });

  it("deve fazer login com sucesso", () => {
    cy.login();
    cy.url().should("include", "/dashboard");
  });

  it("deve fazer logout", () => {
    cy.login();
    cy.logout();
    cy.url().should("include", "/login");
  });

  it("deve redirecionar para login se nao autenticado", () => {
    cy.visit("/colaboradores");
    cy.url().should("include", "/login");
  });
});
