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

  async update(id: string, data: any) {}

  async delete(id: string) {}
}
