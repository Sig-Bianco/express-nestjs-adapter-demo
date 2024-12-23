import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

const express = require('express');
const request = require('supertest');
const legacyApp = require('../../nest-express/src/app'); // Caminho para o arquivo legado

// testes para verificar mudancas em arquivos individuais ele verifica por tamanho de hash
describe('Teste de hash individual', () => {
  const getFileHash = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  };

  it('Deve corresponder ao snapshot de hash dos arquivos legados', () => {
    const filesToCheck = [
      path.join(__dirname, '../../nest-express/src/routes.js'),
      path.join(__dirname, '../../nest-express/src/app.js'),
    ];

    const hashes = filesToCheck.map((filePath) => ({
      filePath,
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
  });
});

// verifica as rotas do legado e testa se continua como deveria os retornos das rotas
describe('Testes Unitários - Rotas do Legado', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(legacyApp);
  });

  describe('GET /products', () => {
    it('Deve retornar todos os produtos', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });
  });

  describe('POST /product', () => {
    it('Deve retornar a mensagem de sucesso ao criar um produto com input "sim"', async () => {
      const response = await request(app).post('/api/product').send({ input: 'sim' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });

    it('Deve retornar a mensagem de falha ao criar um produto com input diferente de "sim"', async () => {
      const response = await request(app).post('/api/product').send({ input: 'nao' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });
  });

  describe('PUT /product', () => {
    it('Deve retornar que o produto 87 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '87' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });

    it('Deve retornar que o produto 98 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '98' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });

    it('Deve retornar que o produto 100 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '100' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });

    it('Deve retornar que nenhum produto foi encontrado', async () => {
      const response = await request(app).put('/api/product').send({ input: '50' });
      expect(response.status).toBe(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});

// teste para verificar se houve mudanca em qualquer arquivo dentro da pasta src ele verifica por tamanho do hash
describe('Teste de hash geral', () => {
  const getFileHash = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  };

  const getAllFiles = (dir: string, fileList: string[] = []) => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllFiles(fullPath, fileList);
      } else {
        fileList.push(fullPath);
      }
    });

    return fileList;
  };

  it('Deve corresponder ao snapshot de hash de todos os arquivos legados geral', () => {
    const legacyDir = path.join(__dirname, '../../nest-express/src');
    const files = getAllFiles(legacyDir);

    const hashes = files.map((filePath) => ({
      filePath: path.relative(legacyDir, filePath),
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
  });
});

// teste para verificar se houve mudanca nas rotas ou middlewares do legado
describe('Teste Rotas do App Legado', () => {
  it('Deve corresponder ao snapshot das rotas legadas', () => {
    const routes = getExpressRoutes(legacyApp);
    expect(routes).toMatchSnapshot();
  });

  it('Deve corresponder ao snapshot dos middlewares legados', () => {
    const middlewares = getExpressMiddlewares(legacyApp);
    expect(middlewares).toMatchSnapshot();
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

// captura os middlewares do legado
function getExpressMiddlewares(app) {
  return app._router.stack.map((middleware) => middleware.name || 'anonymous');
}
