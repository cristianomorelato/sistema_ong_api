import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export async function seedUsers(prisma: PrismaClient) {
  const password = await bcrypt.hash('admin123', 10);

  const users = [
    {
      email: 'admin@system.com.br',
      password,
      userType: UserType.ADMIN,
    },
    {
      email: 'medico@system.com.br',
      password,
      userType: UserType.DOCTOR,
    },
    {
      email: 'medico2@system.com.br',
      password,
      userType: UserType.DOCTOR,
    },
    {
      email: 'medico3@system.com.br',
      password,
      userType: UserType.DOCTOR,
    },
    {
      email: 'acolhimento@system.com.br',
      password,
      userType: UserType.RECEPTION,
    },
    {
      email: 'acolhimento2@system.com.br',
      password,
      userType: UserType.RECEPTION,
    },
    {
      email: 'acolhimento3@system.com.br',
      password,
      userType: UserType.RECEPTION,
    },
    {
      email: 'paciente@system.com.br',
      password,
      userType: UserType.PATIENT,
    },
    {
      email: 'paciente2@system.com.br',
      password,
      userType: UserType.PATIENT,
    },
    {
      email: 'paciente3@system.com.br',
      password,
      userType: UserType.PATIENT,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log('[Seed] Users seeded');
}
