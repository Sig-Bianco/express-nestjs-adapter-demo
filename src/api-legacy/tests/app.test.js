const request = require('supertest');
const app = require('../src/app');

describe('Testes Unitários - Rotas do Legado', () => {
  describe('Lista os produtos', () => {
    it('Deve retornar todos os produtos', async () => {
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Retorna todos produtos' });
    });
  });

  describe('Cria os produtos', () => {
    it('Deve retornar a mensagem de sucesso ao criar um produto com input "sim"', async () => {
      const response = await request(app).post('/api/product').send({ input: 'sim' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'entrou na condicao da criacao do produto',
      });
    });

    it('Deve retornar a mensagem de falha ao criar um produto com input diferente de "sim"', async () => {
      const response = await request(app).post('/api/product').send({ input: 'nao' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'nao entrou na condicao da criacao do produto',
      });
    });
  });

  describe('Atualiza os produtos', () => {
    it('Deve retornar que o produto 87 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '87' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'o produto 87 foi atualizado' });
    });

    it('Deve retornar que o produto 98 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '98' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'o produto 98 foi atualizado' });
    });

    it('Deve retornar que o produto 100 foi atualizado', async () => {
      const response = await request(app).put('/api/product').send({ input: '100' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'o produto 100 foi atualizado' });
    });

    it('Deve retornar que nenhum produto foi encontrado', async () => {
      const response = await request(app).put('/api/product').send({ input: '50' });
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'nao achou nenhum produto' });
    });
  });
});
