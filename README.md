
# Express Adapter Demo

Este projeto demonstra como integrar um aplicativo legado em **Express** com uma aplicação moderna em **NestJS**. 

## 📋 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Node.js (versão 16+ recomendada)
- npm ou yarn

## 🚀 Como Usar

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/seu-repositorio.git
cd express-nestjs-adapter-demo
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configuração da Integração

O aplicativo legado em Express está localizado em `api-legacy/src/app.js`. Ele expõe algumas rotas como `/products` e `/product`. Para usá-lo em conjunto com o NestJS:

#### No NestJS:

1. **Importe a aplicação legado no `main.ts`:**

```typescript
import * as legacyApp from '../api-legacy/src/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Integração com o aplicativo legado
  app.use(legacyApp);

  await app.listen(3000);
}
bootstrap();
```

2. As rotas do legado estarão disponíveis sob `/api` no NestJS.

### 4. Rodando o Servidor

Inicie o servidor com o comando:

```bash
npm run start
```

O NestJS estará rodando na porta padrão `3000`.

- Rotas do NestJS: `/`
- Rotas do Express (legado): `/api/products`, `/api/product`, etc.

---

## 🧪 Testes

O projeto utiliza **Vitest** como framework de testes. Siga os passos para rodar os testes.

### 1. Testando o Legado

As rotas do legado possuem testes unitários em `test/legacy-app.spec.ts`.

Rode os testes com:

```bash
npm run test
```

### 2. Gerar Snapshot de Testes

Para gerar novos snapshots após realizar mudanças no código legado ou nos arquivos relacionados, utilize o seguinte comando:

```bash
npm run test:snapshot
```

Este comando deve ser utilizado **somente** após revisar cuidadosamente as mudanças para garantir que os novos snapshots reflitam as alterações desejadas.

---

### 3. Ver Resultados dos Testes

Após rodar os testes, será exibido o resultado no terminal, incluindo informações sobre testes que passaram ou falharam.


## Testes de Caracterização

Testes de caracterização são úteis para documentar e verificar o comportamento atual de uma aplicação, especialmente em cenários de legado. Eles ajudam a capturar o estado existente do sistema antes de implementar alterações. Abaixo estão os testes implementados na aplicação.

## Teste de Hash Individual

Este teste verifica se os arquivos principais do sistema legado (`app.js` e `routes.js`) permanecem inalterados em termos de conteúdo. Ele utiliza um hash SHA-256 para garantir integridade.

```typescript
describe('Teste de hash individual', () => {
  const getFileHash = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  };

  it('Deve corresponder ao snapshot de hash dos arquivos legados', () => {
    const filesToCheck = [
      path.join(__dirname, '../../api-legacy/src/routes.js'),
      path.join(__dirname, '../../api-legacy/src/app.js'),
    ];

    const hashes = filesToCheck.map((filePath) => ({
      filePath,
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
  });
});
```

## Testes Unitários das Rotas do Sistema Legado

Estes testes validam as rotas existentes no sistema legado e garantem que os comportamentos esperados não mudem. As rotas testadas incluem:

- **GET `/products`**: Retorna todos os produtos.
- **POST `/product`**: Processa a criação de um produto com base no `input`.
- **PUT `/product`**: Atualiza produtos específicos com base no `input`.

### Exemplo de Teste para Rotas

```typescript
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
});
```

## Teste de Hash Geral

Este teste verifica todas as alterações realizadas nos arquivos do sistema legado dentro do diretório `src`.

```typescript
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
    const legacyDir = path.join(__dirname, '../../api-legacy/src');
    const files = getAllFiles(legacyDir);

    const hashes = files.map((filePath) => ({
      filePath: path.relative(legacyDir, filePath),
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
  });
});
```

## Testes de Rotas e Middlewares do Legado

Além de capturar o comportamento das rotas, esses testes verificam a integridade das rotas e middlewares do sistema legado.

### Exemplo de Testes

```typescript
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
```

## Conclusão

Os testes de caracterização são uma parte essencial para manter a estabilidade do sistema legado, permitindo alterações com confiança e garantindo que o comportamento existente seja preservado.


---

## 📁 Estrutura de Diretórios

```
express-nestjs-adapter-demo/
├── api-legacy/
│   ├── src/
│   │   └── app.js        # Aplicação Express legado
├── api-nestjs/
│   ├── src/
│   │   ├── app.controller.ts  # Controlador principal do NestJS
│   │   ├── app.module.ts      # Módulo principal do NestJS
│   │   └── main.ts            # Configuração inicial do NestJS
├── test/
│   ├── legacy-app.spec.ts     # Testes unitários das rotas do legado
├── package.json               # Configurações de scripts e dependências
```

