import "dotenv/config";
import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { prisma } from "../src/config/database.js";

const DEFAULT_CATEGORIES = [
  { name: "Alimentação", icon: "🍔", color: "#FF6B6B", budget: 1200 },
  { name: "Transporte", icon: "🚗", color: "#4ECDC4", budget: 400 },
  { name: "Moradia", icon: "🏠", color: "#45B7D1", budget: 2200 },
  { name: "Lazer", icon: "🎮", color: "#96CEB4", budget: 450 },
  { name: "Saúde", icon: "💊", color: "#F59E0B", budget: 500 },
  { name: "Educação", icon: "📚", color: "#8B5CF6", budget: 350 },
];

function daysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function monthsAgoDay(monthsAgo: number, day: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - monthsAgo, day, 12, 0, 0);
}

async function createDefaultCategories(userId: string) {
  const categories = DEFAULT_CATEGORIES.map((category) => ({
    id: randomUUID(),
    name: category.name,
    icon: category.icon,
    color: category.color,
    budget: category.budget,
    userId,
  }));

  await prisma.category.createMany({ data: categories });
  console.log(`   ✅ ${categories.length} categorias criadas`);
  return categories;
}

async function createExampleUser() {
  const hashedPassword = await bcrypt.hash("123456", 10);
  const user = await prisma.user.create({
    data: {
      id: randomUUID(),
      name: "Marcus Phellypp",
      email: "marcus@example.com",
      password: hashedPassword,
    },
  });

  console.log(`✅ Usuário criado: ${user.email} (senha: 123456)`);
  return user;
}

async function createExampleWallets(userId: string) {
  const mainWallet = await prisma.wallet.create({
    data: {
      name: "Conta Principal",
      currency: "BRL",
      initialBalance: 5500.0,
      userId,
    },
  });

  const cardWallet = await prisma.wallet.create({
    data: {
      name: "Cartão Nubank",
      currency: "BRL",
      initialBalance: 2500.0,
      userId,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { defaultWalletId: mainWallet.id },
  });

  console.log(`✅ Carteiras criadas: ${mainWallet.name}, ${cardWallet.name}`);
  return { mainWallet, cardWallet };
}

async function createExampleExpenses(
  mainWalletId: string,
  cardWalletId: string,
  categories: { id: string; name: string }[],
) {
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

  const expenses = [
    // Mês atual
    {
      description: "Aluguel apartamento",
      amount: 1650.0,
      expenseDate: monthsAgoDay(0, 5),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Moradia")!,
      paymentMethod: "BANK_TRANSFER" as const,
    },
    {
      description: "Internet fibra",
      amount: 119.9,
      expenseDate: monthsAgoDay(0, 8),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Moradia")!,
      paymentMethod: "PIX" as const,
    },
    {
      description: "Supermercado semanal",
      amount: 342.5,
      expenseDate: daysAgo(2),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Alimentação")!,
      paymentMethod: "DEBIT_CARD" as const,
    },
    {
      description: "Almoço no restaurante",
      amount: 46.9,
      expenseDate: daysAgo(1),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Alimentação")!,
      paymentMethod: "PIX" as const,
    },
    {
      description: "Uber para o trabalho",
      amount: 24.5,
      expenseDate: daysAgo(1),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Transporte")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    {
      description: "Uber para casa",
      amount: 22.8,
      expenseDate: daysAgo(3),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Transporte")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    {
      description: "Netflix",
      amount: 55.9,
      expenseDate: monthsAgoDay(0, 10),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Lazer")!,
      paymentMethod: "CREDIT_CARD" as const,
      isRecurring: true,
      recurrenceType: "MONTHLY" as const,
    },
    {
      description: "Academia mensalidade",
      amount: 129.0,
      expenseDate: monthsAgoDay(0, 2),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Saúde")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    {
      description: "Curso online TypeScript",
      amount: 89.9,
      expenseDate: daysAgo(4),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Educação")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    // Mês anterior
    {
      description: "Aluguel apartamento",
      amount: 1650.0,
      expenseDate: monthsAgoDay(1, 5),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Moradia")!,
      paymentMethod: "BANK_TRANSFER" as const,
    },
    {
      description: "Energia elétrica",
      amount: 184.3,
      expenseDate: monthsAgoDay(1, 12),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Moradia")!,
      paymentMethod: "PIX" as const,
    },
    {
      description: "Supermercado semanal",
      amount: 298.7,
      expenseDate: monthsAgoDay(1, 18),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Alimentação")!,
      paymentMethod: "DEBIT_CARD" as const,
    },
    {
      description: "Almoço no restaurante",
      amount: 42.0,
      expenseDate: monthsAgoDay(1, 20),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Alimentação")!,
      paymentMethod: "PIX" as const,
    },
    {
      description: "Uber para o trabalho",
      amount: 26.0,
      expenseDate: monthsAgoDay(1, 21),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Transporte")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    {
      description: "Cinema com amigos",
      amount: 78.0,
      expenseDate: monthsAgoDay(1, 22),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Lazer")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
    // 2 meses atrás
    {
      description: "Aluguel apartamento",
      amount: 1650.0,
      expenseDate: monthsAgoDay(2, 5),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Moradia")!,
      paymentMethod: "BANK_TRANSFER" as const,
    },
    {
      description: "Consulta médica",
      amount: 220.0,
      expenseDate: monthsAgoDay(2, 14),
      walletId: mainWalletId,
      categoryId: categoryMap.get("Saúde")!,
      paymentMethod: "PIX" as const,
    },
    {
      description: "Livros técnicos",
      amount: 115.0,
      expenseDate: monthsAgoDay(2, 19),
      walletId: cardWalletId,
      categoryId: categoryMap.get("Educação")!,
      paymentMethod: "CREDIT_CARD" as const,
    },
  ];

  await prisma.expense.createMany({ data: expenses });
  console.log(`✅ ${expenses.length} despesas criadas`);
}

async function main() {
  console.log("\n🌱 Iniciando seed do banco de dados...\n");

  console.log("🗑️  Limpando dados existentes...");
  await prisma.expense.deleteMany();
  await prisma.category.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();
  console.log("   ✅ Dados limpos\n");

  const user = await createExampleUser();
  const categories = await createDefaultCategories(user.id);
  const { mainWallet, cardWallet } = await createExampleWallets(user.id);
  await createExampleExpenses(mainWallet.id, cardWallet.id, categories);

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
