import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StateService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.state.findMany({
      select: {
        id: true,
        name: true,
        uf: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
