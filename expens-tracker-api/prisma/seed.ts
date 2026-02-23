import "dotenv/config";
import { prisma } from "../src/config/database.js";
import { randomUUID } from "node:crypto";

const DEFAULT_CATEGORIES = [
  {
    name: "Alimentação",
    icon: "🍔",
    color: "#FF6B6B",
  },
  {
    name: "Transporte",
    icon: "🚗",
    color: "#4ECDC4",
  },
  {
    name: "Moradia",
    icon: "🏠",
    color: "#45B7D1",
  },
  {
    name: "Lazer",
    icon: "🎮",
    color: "#96CEB4",
  },
  {
    name: "Saúde",
    icon: "💊",
    color: "#FFEAA7",
  },
  {
    name: "Educação",
    icon: "📚",
    color: "#DDA15E",
  },
];

/**
 * Cria categorias padrão para um usuário
 */
async function createDefaultCategories(userId: string) {
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    id: randomUUID(),
    name: category.name,
    icon: category.icon,
    color: category.color,
    userId: userId,
  }));

  await prisma.category.createMany({
    data: categories,
  });

  console.log(`   ✅ ${categories.length} categorias criadas para o usuário`);
  return categories;
}

async function createExampleUser() {
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "Marcus Phellypp",
      email: "marcus@example.com",
      password: "$2b$10$EXAMPLE_HASH",
    },
  });

  console.log(`✅ Usuário criado: ${user.email}`);
  return user;
}

async function createExampleWallet(userId: string) {
  const wallet = await prisma.wallet.create({
    data: {
      name: "Conta Principal",
      currency: "BRL",
      initialBalance: 1000.0,
      userId: userId,
    },
  });

  console.log(`✅ Carteira criada: ${wallet.name}`);
  return wallet;
}

async function createExampleExpenses(
  walletId: string,
  categories: { id: string; name: string }[],
) {
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  const expenses = [
    {
      description: "Almoço no restaurante",
      amount: 45.9,
      expenseDate: new Date("2026-01-20"),
      walletId: walletId,
      categoryId: categoryMap.get("Alimentação")!,
    },
    {
      description: "Uber para o trabalho",
      amount: 15.5,
      expenseDate: new Date("2026-01-21"),
      walletId: walletId,
      categoryId: categoryMap.get("Transporte")!,
    },
    {
      description: "Conta de luz",
      amount: 180.0,
      expenseDate: new Date("2026-01-15"),
      walletId: walletId,
      categoryId: categoryMap.get("Moradia")!,
    },
    {
      description: "Cinema com amigos",
      amount: 60.0,
      expenseDate: new Date("2026-01-22"),
      walletId: walletId,
      categoryId: categoryMap.get("Lazer")!,
    },
  ];

  await prisma.expense.createMany({
    data: expenses,
  });

  console.log(`✅ ${expenses.length} despesas criadas`);
}

async function main() {
  console.log("\n🌱 Iniciando seed do banco de dados...\n");

  console.log("🗑️  Limpando dados existentes...");
  await prisma.expense.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  console.log("   ✅ Dados limpos\n");

  console.log("👤 Criando usuário de exemplo...");
  const user = await createExampleUser();

  console.log("\n📁 Criando categorias padrão...");
  const categories = await createDefaultCategories(user.id);

  console.log("\n💰 Criando carteira...");
  const wallet = await createExampleWallet(user.id);

  console.log("\n💸 Criando despesas de exemplo...");
  await createExampleExpenses(wallet.id, categories);

  console.log("\n✨ Seed concluído com sucesso!\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("\n❌ Erro durante o seed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
