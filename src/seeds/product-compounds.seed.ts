import { PrismaClient, Status } from '@prisma/client';

export async function seedProductCompounds(prisma: PrismaClient) {
  const company = await prisma.company.findFirst();
  if (!company) {
    console.warn(
      '[Seed] Não foi possível criar ProductCompounds: company não encontrada.',
    );
    return;
  }

  const compounds = [
    {
      name: 'CBD',
      description: 'Canabidiol, composto não psicoativo da cannabis',
      status: Status.ACTIVE,
    },
    {
      name: 'THC',
      description: 'Tetrahidrocanabinol, composto psicoativo da cannabis',
      status: Status.ACTIVE,
    },
    {
      name: 'CBG',
      description: 'Canabigerol, precursor de outros canabinoides',
      status: Status.ACTIVE,
    },
    {
      name: 'CBN',
      description: 'Canabinol, resultado da oxidação do THC',
      status: Status.ACTIVE,
    },
    {
      name: 'CBC',
      description: 'Canabicromeno, canabinoide não psicoativo',
      status: Status.ACTIVE,
    },
  ];

  for (const compound of compounds) {
    const existing = await prisma.productCompounds.findUnique({
      where: { name: compound.name },
    });
    if (existing) {
      await prisma.productCompounds.update({
        where: { id: existing.id },
        data: compound,
      });
    } else {
      await prisma.productCompounds.create({
        data: {
          ...compound,
          company: { connect: { id: company.id } },
        },
      });
    }
  }
  console.log('[Seed] ProductCompounds seeded');
}
