import { prisma } from "../src/config/database.js";
import { randomUUID } from "node:crypto";

const GLOBAL_CATEGORIES = [
    { name: "🍔 Alimentação", icon: "burger", color: "#FF6B6B" },
    { name: "🚗 Transporte", icon: "car", color: "#4ECDC4" },
    { name: "🏠 Moradia", icon: "home", color: "#45B7D1" },
    { name: "🎮 Lazer", icon: "gamepad", color: "#96CEB4" },
    { name: "💊 Saúde", icon: "pill", color: "#FFEAA7" },
    { name: "📚 Educação", icon: "book", color: "#DDA15E" },
];

async function main() {
    console.log("🌱 Criando categorias globais...");

    for (const cat of GLOBAL_CATEGORIES) {
        const existing = await prisma.category.findFirst({
            where: { name: cat.name, userId: null }
        });

        if (!existing) {
            await prisma.category.create({
                data: {
                    id: randomUUID(),
                    name: cat.name,
                    icon: cat.icon,
                    color: cat.color,
                    userId: null
                }
            });
            console.log(`✅ Criada: ${cat.name}`);
        } else {
            console.log(`🟡 Já existe: ${cat.name}`);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());