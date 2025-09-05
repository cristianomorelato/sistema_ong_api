import { PrismaClient, Status } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  // Busca ou cria uma empresa de exemplo
  let company = await prisma.company.findFirst();
  if (!company) {
    company = await prisma.company.create({
      data: {
        corporateName: 'Empresa Exemplo Ltda',
        tradeName: 'Empresa Exemplo',
        cnpj: '12345678000199',
        // Adicione um addressId válido se necessário, ou ajuste conforme seu schema
        addressId: 1, // Supondo que já exista um endereço com id 1
      },
    });
  }

  // Busca ou cria um tipo de produto de exemplo
  let productType = await prisma.productType.findFirst();
  if (!productType) {
    productType = await prisma.productType.create({
      data: {
        name: 'Tipo Exemplo',
        unit_measure: 'un',
        status: Status.ACTIVE,
        company: { connect: { id: company.id } },
      },
    });
  }

  // Busca ou cria um composto de produto de exemplo
  let productCompound = await prisma.productCompounds.findFirst();
  if (!productCompound) {
    productCompound = await prisma.productCompounds.create({
      data: {
        name: 'Composto Exemplo',
        description: 'Composto para testes',
        status: Status.ACTIVE,
        company: { connect: { id: company.id } },
      },
    });
  }

  // Cria produtos de exemplo
  await prisma.product.createMany({
    data: [
      {
        name: 'Produto 1',
        price: 10.5,
        quantity: 100,
        description: 'Primeiro produto de exemplo',
        image_url: 'https://exemplo.com/produto1.jpg',
        productTypeId: productType.id,
        companyId: company.id,
        productCompoundId: productCompound.id,
        status: Status.ACTIVE,
      },
      {
        name: 'Produto 2',
        price: 25.0,
        quantity: 50,
        description: 'Segundo produto de exemplo',
        image_url: 'https://exemplo.com/produto2.jpg',
        productTypeId: productType.id,
        companyId: company.id,
        productCompoundId: productCompound.id,
        status: Status.INACTIVE,
      },
    ],
    skipDuplicates: true,
  });

  console.log('[Seed] Products seeded');
}
