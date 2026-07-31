const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'anuradhak21800@gmail.com';
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.error(`User with email ${email} not found! Please make sure this user has signed up first.`);
    return;
  }
  
  const updatedUser = await prisma.user.update({
    where: { email },
    data: { role: 'SUPER_ADMIN' },
  });
  
  console.log(`Successfully updated ${email} to SUPER_ADMIN!`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
