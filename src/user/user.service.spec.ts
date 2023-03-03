import { Test, TestingModule } from '@nestjs/testing';
import { createTestingConnection } from '../configuration';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: createTestingConnection(User),
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be get all users', async () => {
    const user = await service.findAll();
    expect(user).toMatchSnapshot();
  });

  afterAll(async () => {
    module?.close();
  });
});
