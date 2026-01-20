// V18-E2E: Testes E2E demissao
describe("demissao", () => {
  beforeEach(() => { cy.login(); cy.visit("/demissao"); });

  it("deve carregar pagina", () => {
    cy.url().should("include", "/demissao");
  });

  it("deve exibir componentes", () => {
    cy.get("button").should("have.length.at.least", 1);
  });
});
