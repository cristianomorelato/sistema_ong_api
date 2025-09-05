import { PrismaClient } from '@prisma/client';
import { seedUsers } from './user.seed';
import { seedAddresses } from './address.seed';
import { seedCompanies } from './company.seed';
import { seedAdministrators } from './administrator.seed';
import { seedDoctors } from './doctor.seed';
import { seedPatients } from './patient.seed';
import { seedReceptions } from './reception.seed';
import { seedProductCompounds } from './product-compounds.seed';
import { seedProductTypes } from './product-type.seed';
import { seedProducts } from './product.seed';
import { seedPrescriptions } from './prescription.seed';
import { seedPrescriptionPermissions } from './prescription-permission.seed';

const prisma = new PrismaClient();

async function main() {
  await seedUsers(prisma);
  await seedAddresses(prisma);
  await seedCompanies(prisma);
  await seedAdministrators(prisma);
  await seedDoctors(prisma);
  await seedPatients(prisma);
  await seedReceptions(prisma);
  await seedProductCompounds(prisma);
  await seedProductTypes(prisma);
  await seedProducts(prisma);
  await seedPrescriptions(prisma);
  await seedPrescriptionPermissions(prisma);
}

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
