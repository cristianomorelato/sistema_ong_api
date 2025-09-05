import { PrismaClient, Status } from '@prisma/client';

export async function seedPatients(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: { userType: 'PATIENT' },
    orderBy: { id: 'asc' },
  });
  const company = await prisma.company.findFirst();
  const doctor = await prisma.doctor.findFirst();
  const address = await prisma.address.findFirst();

  if (users.length < 3 || !company || !doctor || !address) {
    console.warn(
      '[Seed] Não foi possível criar Patients: dependências não encontradas.',
    );
    return;
  }

  const patients = [
    {
      userId: users[0]?.id,
      companyId: company.id,
      doctorId: doctor.id,
      addressId: address.id,
      name: 'Ana Paula Souza',
      cpf: '59220292904',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Feminino',
      phone: '11999990001',
      observations: 'Seed patient 1',
      status: Status.ACTIVE,
    },
    {
      userId: users[1]?.id,
      companyId: company.id,
      doctorId: doctor.id,
      addressId: address.id,
      name: 'Carlos Eduardo Lima',
      cpf: '79584477951',
      dateOfBirth: new Date('1991-02-02'),
      gender: 'Masculino',
      phone: '11999990002',
      observations: 'Seed patient 2',
      status: Status.ACTIVE,
    },
    {
      userId: users[2]?.id,
      companyId: company.id,
      doctorId: doctor.id,
      addressId: address.id,
      name: 'Mariana Silva',
      cpf: '84375698934',
      dateOfBirth: new Date('1992-03-03'),
      gender: 'Feminino',
      phone: '11999990003',
      observations: 'Seed patient 3',
      status: Status.ACTIVE,
    },
  ];

  for (const patient of patients) {
    if (!patient.userId) continue;
    await prisma.patient.upsert({
      where: { cpf: patient.cpf },
      update: {},
      create: patient,
    });
  }
  console.log('[Seed] Patients seeded');
}
