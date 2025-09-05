import { PrismaClient, Status } from '@prisma/client';

export async function seedProductTypes(prisma: PrismaClient) {
  const company = await prisma.company.findFirst();
  if (!company) {
    throw new Error(
      'Nenhuma company encontrada. Crie uma company antes de rodar este seed.',
    );
  }

  const productTypes = [
    {
      name: 'Flor',
      unit_measure: 'g',
      status: Status.ACTIVE,
    },
    {
      name: 'Óleo',
      unit_measure: 'un',
      status: Status.ACTIVE,
    },
    {
      name: 'Concentrado',
      unit_measure: 'g',
      status: Status.ACTIVE,
    },
  ];

  for (const type of productTypes) {
    const existing = await prisma.productType.findFirst({
      where: { name: type.name, unit_measure: type.unit_measure },
    });
    if (existing) {
      await prisma.productType.update({
        where: { id: existing.id },
        data: type,
      });
    } else {
      await prisma.productType.create({
        data: {
          ...type,
          company: { connect: { id: company.id } },
        },
      });
    }
  }
  console.log('[Seed] ProductTypes seeded');
}
