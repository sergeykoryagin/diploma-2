import { z } from 'zod';
import { routeWithCoordinatesSchema } from './routes';
import { paginationMetadataSchema } from './common';

/**
 * Схема для параметров запроса рекомендаций
 */
export const recommendationsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

/**
 * Схема для ответа API рекомендаций
 */
export const recommendationsResponseSchema = z.object({
  routes: z.array(routeWithCoordinatesSchema),
  metadata: paginationMetadataSchema
});

/**
 * Типы на основе схем
 */
export type RecommendationsQuery = z.infer<typeof recommendationsQuerySchema>;
export type RecommendationsResponse = z.infer<typeof recommendationsResponseSchema>; 