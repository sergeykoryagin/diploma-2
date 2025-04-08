import { z } from 'zod';

/**
 * Схема для метаданных пагинации
 */
export const paginationMetadataSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

/**
 * Схема для автора маршрута
 */
export const authorSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
});

/**
 * Типы на основе схем
 */
export type PaginationMetadata = z.infer<typeof paginationMetadataSchema>;
export type Author = z.infer<typeof authorSchema>; 