import { z } from 'zod';
import { routeSchema } from './routes';
import { paginationMetadataSchema } from './common';

/**
 * Схема для лайка
 */
export const likeSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  userId: z.string(),
  routeId: z.string(),
});

/**
 * Схема для добавления/удаления лайка
 */
export const toggleLikeSchema = z.object({
  routeId: z.string(),
});

/**
 * Схема для избранного
 */
export const favoriteSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  userId: z.string(),
  routeId: z.string(),
});

/**
 * Схема для добавления/удаления из избранного
 */
export const toggleFavoriteSchema = z.object({
  routeId: z.string(),
});

/**
 * Схема для параметров запроса избранных маршрутов
 */
export const favoritesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

/**
 * Схема для ответа API лайков
 */
export const likesResponseSchema = z.object({
  likes: z.array(likeSchema),
  metadata: paginationMetadataSchema,
});

/**
 * Схема для ответа API избранных
 */
export const favoritesResponseSchema = z.object({
  favorites: z.array(routeSchema),
  metadata: paginationMetadataSchema,
});

/**
 * Схема для ответа о статусе лайка
 */
export const likeStatusSchema = z.object({
  liked: z.boolean(),
  count: z.number().int().nonnegative(),
});

/**
 * Схема для ответа о статусе избранного
 */
export const favoriteStatusSchema = z.object({
  favorited: z.boolean(),
});

/**
 * Типы на основе схем
 */
export type Like = z.infer<typeof likeSchema>;
export type ToggleLikeInput = z.infer<typeof toggleLikeSchema>;
export type Favorite = z.infer<typeof favoriteSchema>;
export type ToggleFavoriteInput = z.infer<typeof toggleFavoriteSchema>;
export type FavoritesQuery = z.infer<typeof favoritesQuerySchema>;
export type LikesResponse = z.infer<typeof likesResponseSchema>;
export type FavoritesResponse = z.infer<typeof favoritesResponseSchema>;
export type LikeStatus = z.infer<typeof likeStatusSchema>;
export type FavoriteStatus = z.infer<typeof favoriteStatusSchema>; 