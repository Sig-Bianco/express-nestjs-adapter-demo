const legacyApp = require('../../src/api-legacy/src/app'); // Caminho para o arquivo legado

// teste para verificar se houve mudanca nas rotas ou middlewares do legado
describe('Teste Rotas do App Legado', () => {
  it('Deve corresponder ao snapshot dos middlewares legados', () => {
    const middlewares = getExpressMiddlewares(legacyApp);
    expect(middlewares).toMatchSnapshot();
  });
});

// captura os middlewares do legado
function getExpressMiddlewares(app) {
  return app._router.stack.map((middleware) => middleware.name || 'anonymous');
}
