import { prisma } from "../src/config/database.js";

const MAPPING = [
    { oldName: "🍔 Alimentação", newName: "Alimentação", icon: "🍔" },
    { oldName: "🚗 Transporte", newName: "Transporte", icon: "🚗" },
    { oldName: "🏠 Moradia", newName: "Moradia", icon: "🏠" },
    { oldName: "🎮 Lazer", newName: "Lazer", icon: "🎮" },
    { oldName: "💊 Saúde", newName: "Saúde", icon: "💊" },
    { oldName: "📚 Educação", newName: "Educação", icon: "📚" },
];

async function main() {
    console.log("🔄 Iniciando atualização das categorias...");

    for (const item of MAPPING) {
        const result = await prisma.category.updateMany({
            where: {
                name: item.oldName,
            },
            data: {
                name: item.newName,
                icon: item.icon,
            },
        });

        if (result.count > 0) {
            console.log(`✅ Atualizadas ${result.count} instâncias de: "${item.oldName}" -> "${item.newName}"`);
        } else {
            console.log(`🟡 Nenhuma categoria encontrada com o nome: "${item.oldName}"`);
        }
    }

    console.log("\n✨ Atualização concluída!");
}

main()
    .catch((e) => {
        console.error("❌ Erro ao atualizar categorias:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
