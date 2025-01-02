class AppService {
  getProducts() {
    return { message: 'Retorna todos produtos' };
  }

  createProduct(input) {
    if (input === 'sim') {
      return { message: 'entrou na condicao da criacao do produto' };
    }
    return { message: 'nao entrou na condicao da criacao do produto' };
  }

  updateProduct(input) {
    const productsToUpdate = ['87', '98', '100'];
    if (productsToUpdate.includes(input)) {
      return { message: `o produto ${input} foi atualizado` };
    }
    return { status: 'nao achou nenhum produto' };
  }
}
  
module.exports = new AppService();
  