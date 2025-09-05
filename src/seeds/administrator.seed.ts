import { PrismaClient, Status } from '@prisma/client';

export async function seedAdministrators(prisma: PrismaClient) {
  const user = await prisma.user.findFirst({ where: { userType: 'ADMIN' } });
  const company = await prisma.company.findFirst();
  const address = await prisma.address.findFirst();

  if (!user || !company || !address) {
    console.warn(
      '[Seed] Não foi possível criar Administrators: dependências não encontradas.',
    );
    return;
  }

  const administrators = [
    {
      userId: user.id,
      companyId: company.id,
      name: 'Enzo Eduardo Oliveira',
      cpf: '025.852.847-86',
      dateOfBirth: new Date('1995-03-16'),
      gender: 'Masculino',
      phone: '21995724323',
      observations: 'Administrador seed',
      status: Status.ACTIVE,
      addressId: address.id,
    },
  ];

  for (const admin of administrators) {
    await prisma.administrators.upsert({
      where: { cpf: admin.cpf },
      update: {},
      create: admin,
    });
  }
  console.log('[Seed] Administrators seeded');
}
