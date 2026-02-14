import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database.js";

export class UserService {
  async create({ name, email, password }: any) {
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

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  }

  async update(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        defaultWalletId: true
      }
    })
  }

  async updatePassword(id: string, oldPass: string, newPass: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("Usuário não encontrado!");

    const passwordMatch = await bcrypt.compare(oldPass, user.password);
    if (!passwordMatch) throw new Error("Senha incorreta!");

    const hashedPassword = await bcrypt.hash(newPass, 10);
    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword }
    })
  }

  async delete(id: string) { }
}
