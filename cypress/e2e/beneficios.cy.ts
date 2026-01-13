describe('beneficios',()=>{beforeEach(()=>cy.visit('/'));it('load',()=>cy.get('body').should('exist'));it('nav',()=>cy.url().should('include','/'))});
