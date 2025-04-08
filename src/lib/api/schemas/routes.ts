import { z } from 'zod';
import { paginationMetadataSchema, authorSchema } from './common';

/**
 * Схема для маршрута
 */
export const routeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  tags: z.array(z.string()),
  author: authorSchema,
});

/**
 * Схема для точки маршрута
 */
export const pointSchema = z.object({
  id: z.string(),
  title: z.string(),
  latitude: z.number(),
  longitude: z.number(),
});

/**
 * Схема для расширенного маршрута с точками
 */
export const routeWithPointsSchema = routeSchema.extend({
  points: z.array(pointSchema)
});

/**
 * Схема для параметров запроса маршрутов
 */
export const routesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  tags: z.string().optional().transform(tags => tags?.split(',').filter(Boolean)),
});

/**
 * Схема для ответа API маршрутов
 */
export const routesResponseSchema = z.object({
  routes: z.array(routeSchema),
  meta: paginationMetadataSchema
});

/**
 * Схема для ответа API коротких маршрутов
 */
export const shortRoutesResponseSchema = z.object({
  routes: z.array(routeWithPointsSchema),
  meta: paginationMetadataSchema
});

/**
 * Координаты на карте
 */
export const coordinatesSchema = z.tuple([z.number(), z.number()]);

/**
 * Схема для маршрута с координатами
 */
export const routeWithCoordinatesSchema = routeSchema.extend({
  coordinates: coordinatesSchema.optional()
});

/**
 * Типы на основе схем
 */
export type Route = z.infer<typeof routeSchema>;
export type RouteWithCoordinates = z.infer<typeof routeWithCoordinatesSchema>;
export type Point = z.infer<typeof pointSchema>;
export type RouteWithPoints = z.infer<typeof routeWithPointsSchema>;
export type RoutesQuery = z.infer<typeof routesQuerySchema>;
export type RoutesResponse = z.infer<typeof routesResponseSchema>;
export type ShortRoutesResponse = z.infer<typeof shortRoutesResponseSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>; 