import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { mock, MockProxy } from 'jest-mock-extended';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { IPFSService } from '../../src/ipfs/ipfs.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const ipfsServiceMock: MockProxy<IPFSService> = mock<IPFSService>();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(IPFSService)
      .useValue(ipfsServiceMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('/file (POST)', () => {
    return request(app.getHttpServer()).post('/record').expect(201);
  });

  it('/file (GET)', () => {
    return request(app.getHttpServer()).get('/record').expect(200);
  });

  it('/record (POST)', () => {
    return request(app.getHttpServer()).post('/record').expect(201);
  });

  it('/record (GET)', () => {
    return request(app.getHttpServer()).get('/record').expect(200);
  });
});
