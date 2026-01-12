// Cypress E2E Support File - V18
import "./commands";

// Global configurations
Cypress.on("uncaught:exception", (err, runnable) => {
  // Prevent Cypress from failing on uncaught exceptions
  return false;
});

// Before each test
beforeEach(() => {
  // Clear localStorage and sessionStorage
  cy.window().then((win) => {
    win.localStorage.clear();
    win.sessionStorage.clear();
  });
});

// Custom assertions
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check toast notifications
       */
      checkToast(message: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("checkToast", (message: string) => {
  cy.get("[data-testid=toast]", { timeout: 5000 })
    .should("be.visible")
    .and("contain", message);
});

export {};
