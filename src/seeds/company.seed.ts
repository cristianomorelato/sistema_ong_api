import { PrismaClient, Status } from '@prisma/client';

export async function seedCompanies(prisma: PrismaClient) {
  const address = await prisma.address.findFirst();

  if (!address) {
    console.warn('Nenhum endereço encontrado para associar à empresa.');
    return;
  }

  const companies = [
    {
      corporateName: 'ABEC – ASSOCIAÇÃO BRASILEIRA E ESTUDOS CANÁBICOS',
      tradeName: 'ABECMED',
      cnpj: '41.918.742/0001-88',
      inscricaoEstadual: '',
      inscricaoMunicipal: '',
      phone: '1133380014',
      email: 'contato@abecmed.com.br',
      website: 'www.abecmed.org.br',
      addressId: address.id,
      status: Status.ACTIVE,
    },
  ];

  for (const company of companies) {
    await prisma.company.upsert({
      where: { cnpj: company.cnpj },
      update: {},
      create: company,
    });
  }
  console.log('[Seed] Companies seeded');
}
