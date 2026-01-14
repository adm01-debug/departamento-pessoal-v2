describe('classificacoesE2E',()=>{it('loads',()=>cy.visit('/').get('body').should('exist'));it('nav',()=>cy.get('main').should('be.visible'))});
