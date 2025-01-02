import { vi } from 'vitest';
import { describe, it,  expect } from 'vitest';

describe('Testes Unitários - Rotas do Legado com Mocks', () => {
  let mockRequest;
  let mockResponse;
  let nextFunction;
  let appService;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    setup();
  });

  describe('GET /products', () => {
    /**
     * Testa a rota GET /products usando mock dinâmico com a implementação real.
     * Isso permite capturar mudanças no código legado sem depender de supertest.
     */
    it('Deve retornar os produtos', () => {
      const originalGetProducts = appService.getProducts;
  
      const spy = vi.spyOn(appService, 'getProducts').mockImplementation(() => {
        return originalGetProducts.call(appService);
      });
  
      const getProductsHandler = (req, res) => {
        const result = appService.getProducts();
        res.status(200).json(result);
      };
  
      getProductsHandler(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('POST /product', () => {
    /**
     * Testa a criação de um produto com input "sim".
     * Reflete diretamente o comportamento do código legado e verifica se o retorno
     * está de acordo com o snapshot armazenado.
     */
    it('Deve criar produtos com a condição de input "sim"', () => {
      const originalCreateProduct = appService.createProduct;
  
      const spy = vi.spyOn(appService, 'createProduct').mockImplementation((input) => {
        return originalCreateProduct.call(appService, input);
      });
  
      mockRequest = { body: { input: 'sim' } };
  
      const createProductHandler = (req, res) => {
        const result = appService.createProduct(req.body.input); // Usa o spy
        res.status(200).json(result);
      };
  
      createProductHandler(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('sim');
    });
  
    /**
     * Testa a criação de um produto com input diferente de "sim".
     * Reflete diretamente o comportamento do código legado e verifica se o retorno
     * está de acordo com o snapshot armazenado.
     */
    it('Deve criar produtos com a condição de diferente de "sim"', () => {
      const originalCreateProduct = appService.createProduct;
  
      const spy = vi.spyOn(appService, 'createProduct').mockImplementation((input) => {
        return originalCreateProduct.call(appService, input);
      });
  
      mockRequest = { body: { input: 'nao' } };
  
      const createProductHandler = (req, res) => {
        const result = appService.createProduct(req.body.input);
        res.status(200).json(result);
      };
  
      createProductHandler(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('nao');
    });
  });
  
  describe('PUT /product', () => {
    /**
     * Testa a atualização de um produto existente.
     * Reflete diretamente o comportamento do código legado e verifica se o retorno
     * está de acordo com o snapshot armazenado.
     */
    it('Deve atualizar um produto existente', () => {
      const originalUpdateProduct = appService.updateProduct;
  
      const spy = vi.spyOn(appService, 'updateProduct').mockImplementation((input) => {
        return originalUpdateProduct.call(appService, input);
      });
  
      mockRequest = { body: { input: '87' } };
  
      const updateProductHandler = (req, res) => {
        const result = appService.updateProduct(req.body.input);
        res.status(200).json(result);
      };
  
      updateProductHandler(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('87');
    });
  
    /**
     * Testa a tentativa de atualização de um produto inexistente.
     * Reflete diretamente o comportamento do código legado e verifica se o retorno
     * está de acordo com o snapshot armazenado.
     */
    it('Deve tentar atualizar um produto inexistente', () => {
      const originalUpdateProduct = appService.updateProduct;
  
      const spy = vi.spyOn(appService, 'updateProduct').mockImplementation((input) => {
        return originalUpdateProduct.call(appService, input);
      });
  
      mockRequest = { body: { input: '50' } };
  
      const updateProductHandler = (req, res) => {
        const result = appService.updateProduct(req.body.input);
        res.status(200).json(result);
      };
  
      updateProductHandler(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json.mock.calls[0][0]).toMatchSnapshot();
      expect(spy).toHaveBeenCalledWith('50');
    });
  });

  const setup = async () => {
    appService = require('../../../api-legacy/src/appService'); // Certifique-se de que está apontando para o módulo correto
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    nextFunction = vi.fn();
	};
  
});