import {
  PrismaClient,
  TxType,
  TxStatus,
  KycStatus,
  Role,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create a Super Admin (ME)
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@vault.app" },
    update: {},
    create: {
      email: "admin@vault.app",
      fullName: "Super Admin",
      password: "hashed-password-123",
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`Created Admin: ${admin.email}`);

  // Create 20 Fake Customers
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    const customer = await prisma.customer.create({
      data: {
        email: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        phoneNumber: faker.phone.number(),
        kycStatus: faker.helpers.arrayElement([
          KycStatus.APPROVED,
          KycStatus.PENDING,
          KycStatus.REJECTED,
        ]),

        // Create  Wallet automatically
        wallets: {
          create: {
            currency: "NGN",
            balance: faker.number.int({ min: 500000, max: 50000000 }), // 5k to 500k Naira (in Kobo)
          },
        },
      },
      include: { wallets: true },
    });

    // 3. Create 5-10 Transactions per Customer
    const txCount = faker.number.int({ min: 5, max: 20 });

    for (let j = 0; j < txCount; j++) {
      await prisma.transaction.create({
        data: {
          amount: faker.number.int({ min: 10000, max: 5000000 }), // 100 to 50k Naira
          fee: 5000, // 50 Naira flat fee
          type: faker.helpers.arrayElement([TxType.CREDIT, TxType.DEBIT]),
          status: faker.helpers.arrayElement([
            TxStatus.SUCCESS,
            TxStatus.SUCCESS,
            TxStatus.FAILED,
          ]), // More success than fail
          reference: `REF-${faker.string.alphanumeric(10).toUpperCase()}`,
          description: faker.finance.transactionDescription(),
          customerId: customer.id,
          // Fake dates within last 30 days
          createdAt: faker.date.recent({ days: 30 }),
        },
      });
    }
    console.log(`Created Customer: ${firstName} with ${txCount} transactions`);
  }

  console.log("✅ Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
