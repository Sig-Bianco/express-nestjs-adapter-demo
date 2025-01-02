import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

// testes para verificar mudancas em arquivos individuais ele verifica por tamanho de hash
describe('Teste de hash individual', () => {
  const getFileHash = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
  };

  it('Deve corresponder ao snapshot de hash dos arquivos legados', () => {
    const filesToCheck = [
      path.join(__dirname, '../../src/api-legacy/src/routes.js'),
      path.join(__dirname, '../../src/api-legacy/src/app.js'),
    ];

    const hashes = filesToCheck.map((filePath) => ({
      filePath,
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
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
    const legacyDir = path.join(__dirname, '../../src/api-legacy/src');
    const files = getAllFiles(legacyDir);

    const hashes = files.map((filePath) => ({
      filePath: path.relative(legacyDir, filePath),
      hash: getFileHash(filePath),
    }));

    expect(hashes).toMatchSnapshot();
  });
});
