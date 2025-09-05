import { PrismaClient } from '@prisma/client';

export async function seedPrescriptionPermissions(prisma: PrismaClient) {
  // Busca os 10 primeiros registros de prescription
  const prescriptions = await prisma.prescription.findMany({
    where: { id: { lte: 10 } },
    take: 10,
    orderBy: { id: 'asc' },
  });
  const productCompound = await prisma.productCompounds.findFirst();
  const productType = await prisma.productType.findFirst();

  if (!productCompound || !productType) {
    console.error(
      'É necessário ter pelo menos um registro de productCompounds e productType para criar o seed de PrescriptionPermission.',
    );
    return;
  }

  const data = prescriptions.map((prescription, idx) => ({
    prescriptionId: prescription.id,
    productCompoundsId: productCompound.id,
    productTypeId: productType.id,
    monthlyLimit: 10 + idx,
    allowed: idx % 2 === 0,
  }));

  if (data.length > 0) {
    await prisma.prescriptionPermission.createMany({
      data,
      skipDuplicates: true,
    });
    console.log(
      'Seed de PrescriptionPermission criado para prescriptions até id 10!',
    );
  } else {
    console.log('Nenhuma prescription encontrada até o id 10.');
  }
}
