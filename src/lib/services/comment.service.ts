import { prisma } from '@/lib/db/prisma';
import { CreateCommentInput, UpdateCommentInput } from '@/lib/api/schemas/comments';
import { Comment, Prisma } from '@prisma/client';

export class CommentService {
  /**
   * Получить комментарии для маршрута
   */
  static async getComments(
    routeId: string,
    page: number = 1,
    limit: number = 10,
    parentId?: string
  ): Promise<{
    comments: Comment[];
    total: number;
  }> {
    const skip = (page - 1) * limit;
    const where: Prisma.CommentWhereInput = {
      routeId,
      parentId: parentId || null,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          // Загружаем вложенные комментарии только если мы на первом уровне
          replies: parentId ? false : {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
            take: 2, // Ограничиваем количество загружаемых ответов
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments, total };
  }

  /**
   * Создать новый комментарий
   */
  static async createComment(
    userId: string,
    data: CreateCommentInput
  ): Promise<Comment> {
    // Если указан parentId, проверяем, что родительский комментарий существует
    if (data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: data.parentId },
      });

      if (!parentComment) {
        throw new Error('Родительский комментарий не найден');
      }

      // Убеждаемся, что родительский комментарий относится к тому же маршруту
      if (parentComment.routeId !== data.routeId) {
        throw new Error('Родительский комментарий относится к другому маршруту');
      }

      // Проверяем, что родительский комментарий не является вложенным (только 2 уровня)
      if (parentComment.parentId) {
        throw new Error('Допускаются комментарии только второго уровня вложенности');
      }
    }

    return prisma.comment.create({
      data: {
        text: data.text,
        routeId: data.routeId,
        userId,
        parentId: data.parentId || null,
      },
    });
  }

  /**
   * Обновить комментарий
   */
  static async updateComment(
    commentId: string,
    userId: string,
    data: UpdateCommentInput
  ): Promise<Comment> {
    // Проверяем, что комментарий существует и принадлежит пользователю
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Комментарий не найден');
    }

    if (comment.userId !== userId) {
      throw new Error('У вас нет прав на редактирование этого комментария');
    }

    return prisma.comment.update({
      where: { id: commentId },
      data: {
        text: data.text,
      },
    });
  }

  /**
   * Удалить комментарий
   */
  static async deleteComment(
    commentId: string,
    userId: string
  ): Promise<void> {
    // Проверяем, что комментарий существует и принадлежит пользователю
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new Error('Комментарий не найден');
    }

    if (comment.userId !== userId) {
      throw new Error('У вас нет прав на удаление этого комментария');
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
  }

  /**
   * Получить количество комментариев для маршрута
   */
  static async getCommentsCount(routeId: string): Promise<number> {
    return prisma.comment.count({
      where: { routeId },
    });
  }
} 