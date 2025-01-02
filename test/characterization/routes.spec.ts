import * as path from 'path';

const legacyApp = require('../../src/api-legacy/src/app'); // Caminho para o arquivo legado


// teste para verificar se houve mudanca nas rotas ou middlewares do legado
describe('Teste Rotas do App Legado', () => {
  it('Deve corresponder ao snapshot das rotas legadas', () => {
    const routes = getExpressRoutes(legacyApp);
    expect(routes).toMatchSnapshot();
  });

});

// captura as rotas do legado
function getExpressRoutes(app) {
  const routes = [];
  if (app._router && app._router.stack) {
    app._router.stack.forEach((middleware) => {
      if (middleware.route) {
        const path = middleware.route.path;
        const methods = Object.keys(middleware.route.methods).join(', ');
        routes.push({ path, methods });
      } else if (middleware.name === 'router' && middleware.handle.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler.route) {
            const path = handler.route.path;
            const methods = Object.keys(handler.route.methods).join(', ');
            routes.push({ path: `/api${path}`, methods });
          }
        });
      }
    });
  }
  return routes;
}

