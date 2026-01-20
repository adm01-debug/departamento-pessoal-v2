// V18: Cypress E2E Support
import "./commands";

beforeEach(() => {
  cy.intercept("GET", "**/api/**", { statusCode: 200, body: {} }).as("api");
});

Cypress.on("uncaught:exception", () => false);
