import { prisma } from '@/lib/db/prisma';
import { Route } from '@prisma/client';
export class InteractionService {
  /**
   * Получить статус лайка для маршрута
   */
  static async getLikeStatus(userId: string, routeId: string): Promise<{ liked: boolean; count: number }> {
    const [like, count] = await Promise.all([
      prisma.like.findUnique({
        where: {
          userId_routeId: {
            userId,
            routeId,
          },
        },
      }),
      prisma.route.findUnique({
        where: { id: routeId },
        select: { likesCount: true },
      }),
    ]);

    return {
      liked: !!like,
      count: count?.likesCount || 0,
    };
  }

  /**
   * Переключить лайк для маршрута
   */
  static async toggleLike(userId: string, routeId: string): Promise<{ liked: boolean; count: number }> {
    // Проверяем существование маршрута
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error('Маршрут не найден');
    }

    // Проверяем, лайкнул ли пользователь этот маршрут
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_routeId: {
          userId,
          routeId,
        },
      },
    });

    // Если лайк уже существует - удаляем его, иначе - создаем
    let newLikesCount = route.likesCount;
    
    if (existingLike) {
      // Удаляем лайк
      await prisma.like.delete({
        where: {
          userId_routeId: {
            userId,
            routeId,
          },
        },
      });
      newLikesCount = Math.max(0, route.likesCount - 1);
    } else {
      // Добавляем лайк
      await prisma.like.create({
        data: {
          userId,
          routeId,
        },
      });
      newLikesCount = route.likesCount + 1;
    }

    // Обновляем счетчик лайков в маршруте
    await prisma.route.update({
      where: { id: routeId },
      data: { likesCount: newLikesCount },
    });

    return {
      liked: !existingLike,
      count: newLikesCount,
    };
  }

  /**
   * Получить статус избранного для маршрута
   */
  static async getFavoriteStatus(userId: string, routeId: string): Promise<{ favorited: boolean }> {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_routeId: {
          userId,
          routeId,
        },
      },
    });

    return {
      favorited: !!favorite,
    };
  }

  /**
   * Переключить избранное для маршрута
   */
  static async toggleFavorite(userId: string, routeId: string): Promise<{ favorited: boolean }> {
    // Проверяем существование маршрута
    const route = await prisma.route.findUnique({
      where: { id: routeId },
    });

    if (!route) {
      throw new Error('Маршрут не найден');
    }

    // Проверяем, добавлен ли маршрут в избранное
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_routeId: {
          userId,
          routeId,
        },
      },
    });

    // Если избранное уже существует - удаляем его, иначе - создаем
    if (existingFavorite) {
      // Удаляем из избранного
      await prisma.favorite.delete({
        where: {
          userId_routeId: {
            userId,
            routeId,
          },
        },
      });
    } else {
      // Добавляем в избранное
      await prisma.favorite.create({
        data: {
          userId,
          routeId,
        },
      });
    }

    return {
      favorited: !existingFavorite,
    };
  }

  /**
   * Получить список избранных маршрутов пользователя
   */
  static async getUserFavorites(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    routes: Route[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      prisma.favorite.findMany({
        where: { userId },
        include: {
          route: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.favorite.count({
        where: { userId },
      }),
    ]);

    // Преобразуем данные к формату, который возвращает API маршрутов
    const routes = favorites.map(favorite => favorite.route);

    return { routes, total };
  }
} 