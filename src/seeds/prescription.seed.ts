import { PrismaClient, Status } from '@prisma/client';

export async function seedPrescriptions(prisma: PrismaClient) {
  const patient = await prisma.patient.findFirst();
  const doctor = await prisma.doctor.findFirst();

  if (!patient || !doctor) {
    console.warn(
      '[Seed] Não foi possível criar Prescriptions: dependências não encontradas.',
    );
    return;
  }

  const prescriptions = [
    {
      patientId: patient.id,
      doctorId: doctor.id,
      prescriptionDate: new Date('2025-08-01T10:00:00.000Z'),
      validityDays: 30,
      uploadedAt: new Date('2025-08-01T10:00:00.000Z'),
      linkPrescription: 'https://exemplo.com/prescricao1.pdf',
      disease: 'Glaucoma',
      observations: 'Tomar 1x ao dia',
      status: Status.ACTIVE,
    },
    {
      patientId: patient.id,
      doctorId: doctor.id,
      prescriptionDate: new Date('2025-08-10T15:00:00.000Z'),
      validityDays: 60,
      uploadedAt: new Date('2025-08-10T15:00:00.000Z'),
      linkPrescription: 'https://exemplo.com/prescricao2.pdf',
      disease: 'Dor crônica',
      observations: 'Tomar 2x ao dia',
      status: Status.ACTIVE,
    },
    {
      patientId: patient.id,
      doctorId: doctor.id,
      prescriptionDate: new Date('2025-08-15T09:00:00.000Z'),
      validityDays: 90,
      uploadedAt: new Date('2025-08-15T09:00:00.000Z'),
      linkPrescription: 'https://exemplo.com/prescricao3.pdf',
      disease: 'Ansiedade',
      observations: 'Tomar 1x ao dia, à noite',
      status: Status.ACTIVE,
    },
  ];

  for (const prescription of prescriptions) {
    await prisma.prescription.create({ data: prescription });
  }

  console.log(`[Seed] Prescriptions criadas: ${prescriptions.length}`);
}
