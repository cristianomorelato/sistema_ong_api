import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;

  beforeEach(async () => {
    usersService = {
      findUserByEmail: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('fake-jwt-token'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return access_token on login', async () => {
    const userMock = {
      userType: 'ADMIN',
      administrators: [{ identifier: 'admin-uuid', name: 'Admin Name' }],
      doctor: [],
      patients: [],
      reception: [],
      email: 'admin@email.com',
      password: 'hashed',
    };
    (usersService.findUserByEmail as jest.Mock).mockResolvedValue(userMock);
    jest.spyOn(service as any, 'validateUser').mockResolvedValue({
      ...userMock,
      identifier: 'admin-uuid',
      name: 'Admin Name',
    });
    const result = service.login({
      identifier: 'admin-uuid',
      name: 'Admin Name',
      email: 'admin@email.com',
      userType: 'ADMIN',
    });
    expect(result).toEqual({ access_token: 'fake-jwt-token' });
  });
});
