import { PrismaClient, Status } from '@prisma/client';

export async function seedReceptions(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: { userType: 'RECEPTION' },
    orderBy: { id: 'asc' },
  });
  const company = await prisma.company.findFirst();
  const address = await prisma.address.findFirst();

  if (users.length < 3 || !company || !address) {
    console.warn(
      '[Seed] Não foi possível criar Receptions: dependências não encontradas.',
    );
    return;
  }

  const receptions = [
    {
      userId: users[0]?.id,
      companyId: company.id,
      addressId: address.id,
      name: 'Beatriz Ramos',
      cpf: '12345678901',
      dateOfBirth: new Date('1995-01-01'),
      gender: 'Feminino',
      phone: '11988880001',
      observations: 'Seed reception 1',
      status: Status.ACTIVE,
    },
    {
      userId: users[1]?.id,
      companyId: company.id,
      addressId: address.id,
      name: 'Lucas Martins',
      cpf: '23456789012',
      dateOfBirth: new Date('1996-02-02'),
      gender: 'Masculino',
      phone: '11988880002',
      observations: 'Seed reception 2',
      status: Status.ACTIVE,
    },
    {
      userId: users[2]?.id,
      companyId: company.id,
      addressId: address.id,
      name: 'Patrícia Oliveira',
      cpf: '34567890123',
      dateOfBirth: new Date('1997-03-03'),
      gender: 'Feminino',
      phone: '11988880003',
      observations: 'Seed reception 3',
      status: Status.ACTIVE,
    },
  ];

  for (const reception of receptions) {
    if (!reception.userId) continue;
    await prisma.reception.upsert({
      where: { cpf: reception.cpf },
      update: {},
      create: reception,
    });
  }
  console.log('[Seed] Receptions seeded');
}
