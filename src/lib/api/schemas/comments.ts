import { z } from 'zod';
import { authorSchema, paginationMetadataSchema } from './common';

/**
 * Схема для комментария
 */
export const commentSchema = z.object({
  id: z.string(),
  text: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  routeId: z.string(),
  parentId: z.string().nullable(),
  user: authorSchema,
});

/**
 * Схема для создания комментария
 */
export const createCommentSchema = z.object({
  text: z.string().min(1, { message: 'Текст комментария не может быть пустым' }).max(1000, { message: 'Комментарий слишком длинный' }),
  routeId: z.string(),
  parentId: z.string().optional(),
});

/**
 * Схема для обновления комментария
 */
export const updateCommentSchema = z.object({
  text: z.string().min(1, { message: 'Текст комментария не может быть пустым' }).max(1000, { message: 'Комментарий слишком длинный' }),
});

/**
 * Схема для параметров запроса комментариев
 */
export const commentsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
  parentId: z.string().optional(),
});

/**
 * Схема для ответа API комментариев
 */
export const commentsResponseSchema = z.object({
  comments: z.array(commentSchema),
  metadata: paginationMetadataSchema,
});

/**
 * Типы на основе схем
 */
export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CommentsQuery = z.infer<typeof commentsQuerySchema>;
export type CommentsResponse = z.infer<typeof commentsResponseSchema>; 