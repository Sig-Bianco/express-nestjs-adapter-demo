
# Integrando NestJS com API Legada (Express)

Este guia é destinado a desenvolvedores que querem integrar um sistema legado, baseado em **Express**, com uma aplicação moderna **NestJS**. O processo é simples e consiste em algumas etapas principais.

## 📋 Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

- Node.js (versão 16+ recomendada)
- npm ou yarn

## 🛠 Passo a Passo

### 1. Estrutura Inicial

Primeiro, crie duas pastas no seu projeto: uma para a aplicação **NestJS** e outra para a API **legada (Express)**. A estrutura do diretório pode ser parecida com esta:

```
meu-projeto/
├── api-legacy/          # Código da API legada em Express
├── api-nestjs/          # Código da aplicação NestJS
```

### 2. Configure a API Legada (Express)

Dentro da pasta `api-legacy`, adicione o código da sua aplicação Express. Por exemplo:

```javascript
// api-legacy/src/app.js
const express = require('express');
const app = express();

app.get('/products', (req, res) => {
  res.json({ message: 'Lista de produtos' });
});

module.exports = app;
```

### 3. Configuração do NestJS

Agora, dentro da pasta `api-nestjs`, crie a aplicação **NestJS**. A principal configuração será a integração com o Express usando o adaptador.

#### 3.1. No `main.ts`, importe o adaptador Express

```typescript
// api-nestjs/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as expressApp from '../../api-legacy/src/app'; // Caminho da sua API legada

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Integração com o Express (API Legada)
  app.use('/api', expressApp);  // Use o Express sob a rota '/api'

  await app.listen(3000);
}

bootstrap();
```

#### 3.2. Rodando a Aplicação

Para rodar sua aplicação, execute:

```bash
npm run start
```

A aplicação NestJS estará rodando na porta `3000` e você poderá acessar as rotas legadas sob `/api`.

- **Rotas do Express (legado)**: `/api/products`, etc.
- **Rotas do NestJS**: Se houver, estarão disponíveis diretamente na raiz.

---

### 4. 🧪 Testes de Caracterização

Testes de caracterização são úteis para documentar e verificar o comportamento atual de uma aplicação, especialmente em cenários de legado. Eles ajudam a capturar o estado existente do sistema antes de implementar alterações. Abaixo estão os testes implementados na aplicação.

Na pasta `test/characterization/` crie uma estrutura parecida com essa.

```
test/
├── characterization/
│   └── endpoints.spec.ts  # Testes de unitários dos endpoints
│   └── routes.spec.ts  # Testes para verificar mudanças em rotas
│   └── middlewares.spec.ts  # Testes para verificar mudanças em middlewares
│   └── file-size.spec.ts  # Testes para verificar mudanças no tamanho de arquivos
```

#### 4.1. Teste de Hash Geral

Este teste verifica todas as alterações realizadas nos arquivos do sistema legado dentro do diretório `src`.

```typescript
// file-size.spec.ts
it('Deve corresponder ao snapshot de hash de todos os arquivos legados geral', () => {
  const legacyDir = path.join(__dirname, '../../api-legacy/src');
  const files = getAllFiles(legacyDir);

  const hashes = files.map((filePath) => ({
    filePath: path.relative(legacyDir, filePath),
    hash: getFileHash(filePath),
  }));

  expect(hashes).toMatchSnapshot();
});
```

#### 4.2. Teste de Hash Individual

Este teste verifica se os arquivos principais do sistema legado (`app.js` e `routes.js`) permanecem inalterados em termos de conteúdo. Ele utiliza um hash SHA-256 para garantir integridade.

```typescript
// file-size.spec.ts
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
```

#### 4.3. Testes de Rotas e Middlewares do Legado

Além de capturar o comportamento das rotas, esses testes verificam a integridade das rotas e middlewares do sistema legado.

```typescript
// routes.ts
it('Deve corresponder ao snapshot das rotas legadas', () => {
  const routes = getExpressRoutes(legacyApp);
  expect(routes).toMatchSnapshot();
});
```

```typescript
// middlewares.ts
it('Deve corresponder ao snapshot dos middlewares legados', () => {
  const middlewares = getExpressMiddlewares(legacyApp);
  expect(middlewares).toMatchSnapshot();
});
```

#### 4.4. Testes de retornos de rotas

Este teste verifica o retorno de enpoints do legado e verifica se houve mudança no comportamento esperado.

```typescript
// endpoints.spec.ts
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
```

#### 4.5. 🧪 Rodando testes

O projeto utiliza **Vitest** como framework de testes. Siga os passos para rodar os testes.

Rode os testes com:

```bash
npm run test
```

#### 4.6. Gerar Snapshot de Testes

Para gerar novos snapshots após realizar mudanças no código legado ou nos arquivos relacionados, utilize o seguinte comando:

```bash
npm run test:snapshot
```

Este comando deve ser utilizado **somente** após revisar cuidadosamente as mudanças para garantir que os novos snapshots reflitam as alterações desejadas.


#### 4.7. Ver Resultados dos Testes

Após rodar os testes, será exibido o resultado no terminal, incluindo informações sobre testes que passaram ou falharam.

---

## 📁 Estrutura de Diretórios

A estrutura do projeto pode ser algo assim:

```
meu-projeto/
├── api-legacy/
│   ├── src/
│   │   └── app.js        # Aplicação Express Legada
├── api-nestjs/
│   ├── src/
│   │   └── app.controller.ts  # Controlador principal do NestJS
│   │   └── app.module.ts      # Módulo principal do NestJS
│   │   └── main.ts            # Configuração do NestJS
├── test/
    ├── characterization/
│       └── endpoints.spec.ts  # Testes de unitários dos endpoints
│       └── routes.spec.ts  # Testes para verificar mudanças em rotas
│       └── middlewares.spec.ts  # Testes para verificar mudanças em middlewares
│       └── file-size.spec.ts  # Testes para verificar mudanças no tamanho de arquivos
├── package.json               # Dependências e scripts
```

---

## 🚀 Conclusão

Com esse processo, você integra uma API legada (Express) com uma aplicação moderna usando NestJS de forma simples e prática.
