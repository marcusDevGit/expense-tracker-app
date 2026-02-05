import bcrypt from "bcrypt";
import { prisma } from "../../config/database.js";
export class UserService {
    async create({ name, email, password }) {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            throw new Error("User já existe!");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });
        return { id: user.id, name: user.name, email: user.email };
    }
    async findById(id) {
        const user = await prisma.user.findUnique({ where: { id } });
        return user;
    }
    async update(id, data) { }
    async delete(id) { }
}
