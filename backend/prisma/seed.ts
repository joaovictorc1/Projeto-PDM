import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const defaults = [
    { name: "income",    displayName: "Renda",        icon: "work",                 color: "#4CAF50" },
    { name: "food",      displayName: "Alimentação",  icon: "fastfood",             color: "#FF9800" },
    { name: "house",     displayName: "Casa",          icon: "home",                 color: "#2196F3" },
    { name: "education", displayName: "Educação",      icon: "book",                 color: "#9C27B0" },
    { name: "travel",    displayName: "Viagens",       icon: "airplanemode-active",  color: "#F44336" },
  ];

  for (const cat of defaults) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: { ...cat, isDefault: true },
    });
  }

  console.log("Seed concluído: 5 categorias padrão inseridas.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
