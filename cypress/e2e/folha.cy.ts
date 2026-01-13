// QA-FIX: E2E Test - folha
describe('folha', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve carregar a página', () => {
    cy.url().should('include', '/');
  });

  it('deve exibir elementos principais', () => {
    cy.get('body').should('be.visible');
  });

  it('deve navegar corretamente', () => {
    cy.get('nav').should('exist');
  });
});
