const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

const main = async () => {
  console.log("Start seeding ... ♻️");

  const users = await prisma.users.findMany();

  if (users.length === 0) {
    const password = await bcrypt.hash("password", 10);
    await prisma.users.create({
      data: {
        first_name: "Admin",
        email: "admin@qspace.com",
        password,
        role: "admin",
      },
    });

    console.log("Seeding users ... 🌱");
  }

  console.log("Seeding finished ✅");
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
