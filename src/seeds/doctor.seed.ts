import { PrismaClient, Status, DocumentDoctorType } from '@prisma/client';

export async function seedDoctors(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: { userType: 'DOCTOR' },
    orderBy: { id: 'asc' },
  });
  const address = await prisma.address.findFirst();
  const company = await prisma.company.findFirst();

  if (users.length < 3 || !address || !company) {
    console.warn(
      '[Seed] Não foi possível criar 3 Doctors: dependências não encontradas.',
    );
    return;
  }

  const doctors = [
    {
      userId: users[0].id,
      name: 'Gabriel Bento Paulo Campos',
      cpf: '12345678901',
      documentDoctorType: DocumentDoctorType.CRM,
      documentDoctorNumber: 'CRM1001',
      documentDoctorUf: 'SP',
      phone: '11999990001',
      observations: 'Seed doctor 1',
      status: Status.ACTIVE,
      addressId: address.id,
      companyId: company.id,
    },
    {
      userId: users[1].id,
      name: 'Juan Tiago Fernandes',
      cpf: '12345678902',
      documentDoctorType: DocumentDoctorType.CRM,
      documentDoctorNumber: 'CRM1002',
      documentDoctorUf: 'SP',
      phone: '11999990002',
      observations: 'Seed doctor 2',
      status: Status.ACTIVE,
      addressId: address.id,
      companyId: company.id,
    },
    {
      userId: users[2].id,
      name: 'Pietro Anthony Caldeira',
      cpf: '12345678903',
      documentDoctorType: DocumentDoctorType.CRM,
      documentDoctorNumber: 'CRM1003',
      documentDoctorUf: 'SP',
      phone: '11999990003',
      observations: 'Seed doctor 3',
      status: Status.ACTIVE,
      addressId: address.id,
      companyId: company.id,
    },
  ];

  for (const doctor of doctors) {
    await prisma.doctor.upsert({
      where: { cpf: doctor.cpf }, // Usar CPF como critério único
      update: {},
      create: doctor,
    });
  }
  console.log('[Seed] Doctors seeded');
}
