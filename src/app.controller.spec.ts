import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { vi } from 'vitest';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
   await setup();
  });

  it('should create a user', () => {
    appController = new AppController(appService)
    expect(appController.create()).toBe('Usuário criado');
  });

  it('should return a list of users', () => {
    appController = new AppController(appService)
    expect(appController.findAll()).toBe('Lista de usuários');
  });

  const setup = async () => {
    const mockAppService = {
      createUser: vi.fn().mockReturnValue('Usuário criado'),
      listUsers: vi.fn().mockReturnValue('Lista de usuários'),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
	};
});
