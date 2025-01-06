import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  createUser(): string {
    return 'Usuário criado';
  }

  listUsers(): string {
    return 'Lista de usuários';
  }
}
