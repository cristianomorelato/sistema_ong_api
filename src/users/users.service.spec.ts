import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: { user: { findUnique: jest.fn() } },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call prisma.user.findUnique with include for relations', async () => {
    const mockPrisma = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          email: 'test@email.com',
          userType: 'ADMIN',
          administrators: [{ identifier: 'admin-uuid', name: 'Admin Name' }],
          doctor: [],
          patients: [],
          reception: [],
        }),
      },
    };
    // @ts-expect-error sobrescrevendo para teste
    service['prisma'] = mockPrisma;
    const result = await service.findUserByEmail('test@email.com');
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'test@email.com' },
      include: {
        administrators: true,
        doctor: true,
        patients: true,
        reception: true,
      },
    });
    expect(result).toHaveProperty('administrators');
    expect(result).toHaveProperty('doctor');
    expect(result).toHaveProperty('patients');
    expect(result).toHaveProperty('reception');
  });
});
