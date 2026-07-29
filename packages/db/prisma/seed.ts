import { prisma } from "../src/index.ts";

async function main() {
  // Create available trigger
  await prisma.availableTriggers.createMany({
    data: [
      {
        type: "Webhook",
        image: "/integrations/webhook.png",
      },
    ],
    skipDuplicates: true,
  });


  // Create available actions
  await prisma.availableActions.createMany({
    data: [
      {
        type: "Email",
        image: "/integrations/email.png",
      },
      {
        type: "Send Solana",
        image: "/integrations/sendSolana.jpg",
      },
    ],
    skipDuplicates: true,
  });


  console.log("Seed data added successfully");
}


main()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });