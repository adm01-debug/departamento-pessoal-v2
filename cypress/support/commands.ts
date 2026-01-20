// V18: Cypress Custom Commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      logout(): Chainable<void>;
      visitPage(path: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email = "admin@teste.com", password = "123456") => {
  cy.visit("/login");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should("not.include", "/login");
});

Cypress.Commands.add("logout", () => {
  cy.get('[data-testid="logout-btn"]').click();
  cy.url().should("include", "/login");
});

Cypress.Commands.add("visitPage", (path: string) => {
  cy.visit(path);
  cy.get("body").should("be.visible");
});

export {};
