// V18-E2E: Testes dashboard
describe("dashboard", () => {
  beforeEach(() => { cy.login(); cy.visit("/dashboard"); });
  it("deve carregar", () => { cy.url().should("include", "/dashboard"); });
});
