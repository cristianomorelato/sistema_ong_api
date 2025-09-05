import { PrismaClient } from '@prisma/client';

export async function seedAddresses(prisma: PrismaClient) {
  const sp = await prisma.state.findUnique({ where: { uf: 'SP' } });
  const rj = await prisma.state.findUnique({ where: { uf: 'RJ' } });
  const mg = await prisma.state.findUnique({ where: { uf: 'MG' } });

  const sorocaba = await prisma.city.findFirst({
    where: { name: 'Sorocaba', stateId: sp?.id },
  });
  const rio = await prisma.city.findFirst({
    where: { name: 'Rio de Janeiro', stateId: rj?.id },
  });
  const bh = await prisma.city.findFirst({
    where: { name: 'Belo Horizonte', stateId: mg?.id },
  });

  const addresses = [
    {
      street: 'Rua João Wagner Wey',
      number: '1269',
      complement: 'Bloco C - AP 104',
      neighborhood: 'Jardim Peres de Mello',
      cityId: sorocaba?.id,
      stateId: sp?.id,
      zipCode: '18046-645',
    },
    {
      street: 'Rua Gustavo Sampaio',
      number: '200',
      complement: null,
      neighborhood: 'Centro',
      cityId: rio?.id,
      stateId: rj?.id,
      zipCode: '22010-010',
    },
    {
      street: 'Av. Afonso Pena',
      number: '3000',
      complement: 'Sala 10',
      neighborhood: 'Centro',
      cityId: bh?.id,
      stateId: mg?.id,
      zipCode: '30130-007',
    },
  ];

  for (const address of addresses) {
    if (!address.cityId || !address.stateId) continue;
    const exists = await prisma.address.findFirst({
      where: {
        street: address.street,
        number: address.number,
        cityId: address.cityId,
        stateId: address.stateId,
      },
    });
    if (!exists) {
      const { cityId, stateId, ...rest } = address;
      await prisma.address.create({
        data: {
          ...rest,
          cityId: cityId,
          stateId: stateId,
        },
      });
    }
  }

  console.log('[Seed] Addresses seeded');
}
