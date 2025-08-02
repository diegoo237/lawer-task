import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('AppController (e2e - Rotas Principais Mínimas)', () => {
  let app: INestApplication;

  const mockJwtAuthGuard = {
    canActivate: (context) => {
      const req = context.switchToHttp().getRequest();
      req.user = { userId: 'test-user-id', email: 'test@example.com' };
      return true;
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/tasks (Listagem de Tarefas)', () => {
    it('deve listar todas as tarefas com sucesso (STATUS 200) com autenticação', async () => {
      return request(app.getHttpServer())
        .get('/api/tasks')
        .set('Authorization', 'Bearer mock-token')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('deve listar todas as tarefas com sucesso (STATUS 200) mesmo sem autenticação', () => {
      return request(app.getHttpServer())
        .get('/api/tasks')
        .expect(HttpStatus.OK)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('POST /api/cliente (Criação de Cliente)', () => {
    it('deve criar um novo cliente com sucesso (STATUS 201)', async () => {
      const newClient = {
        name: 'Test Client',
        email: `test-${Date.now()}@example.com`,
        senha: 'testPassword123',
      };
      return request(app.getHttpServer())
        .post('/api/cliente')
        .send(newClient)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.id).toBeDefined();
          expect(res.body.email).toBe(newClient.email);
          expect(res.body.name).toBe(newClient.name);
        });
    });

    it('deve retornar 400 para dados inválidos', () => {
      return request(app.getHttpServer())
        .post('/api/cliente')
        .send({
          name: 'Test Client',
          email: 'invalid-email', // Email inválido
          senha: 'short', // Senha muito curta
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
