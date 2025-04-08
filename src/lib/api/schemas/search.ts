import { z } from 'zod';
import { routeSchema } from './routes';
import { paginationMetadataSchema } from './common';

/**
 * Схема для параметров запроса поиска
 */
export const searchQuerySchema = z.object({
  query: z.string().min(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

/**
 * Схема для ответа API поиска
 */
export const searchResponseSchema = z.object({
  routes: z.array(routeSchema),
  metadata: paginationMetadataSchema
});

/**
 * Типы на основе схем
 */
export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>; 