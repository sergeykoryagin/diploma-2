import { prisma } from "@/lib/db/prisma";
import { UpdateProfileInput } from "@/lib/api/schemas/profile";
import { User } from "@prisma/client";

export class UserService {
  /**
   * Получить пользователя по ID
   */
  static async getUserById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  /**
   * Получить пользователя по email
   */
  static async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  /**
   * Обновить профиль пользователя
   */
  static async updateProfile(userId: string, data: UpdateProfileInput): Promise<User> {
    // Проверяем, существует ли пользователь
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error(`Пользователь с ID ${userId} не найден`);
    }

    // Проверяем, существует ли уже пользователь с таким email, если email обновляется
    if (data.email && data.email !== user.email) {
      const existingUser = await this.getUserByEmail(data.email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error(`Пользователь с email ${data.email} уже существует`);
      }
    }

    // Обновляем профиль (без изображения, поскольку оно берется из Яндекса)
    return await prisma.user.update({
      where: { id: userId },
      data
    });
  }

  /**
   * Обновить теги пользователя
   */
  static async updateUserTags(userId: string, tags: string[]): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: { tags }
    });
  }
} 