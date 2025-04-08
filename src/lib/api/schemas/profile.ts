import { z } from 'zod';
import { nameSchema, emailSchema, tagsSchema } from '@/lib/validations/user';

/**
 * Схема для ответа API профиля пользователя
 */
export const profileResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().nullable(),
  image: z.string().nullable(), 
  tags: z.array(z.string()),
  createdAt: z.date().optional(),
  updatedAt: z.date()
});

/**
 * Схема для обновления профиля пользователя
 */
export const updateProfileSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
  tags: tagsSchema.optional(),
}).refine(data => {
  // Проверяем, что хотя бы одно поле указано для обновления
  return Object.keys(data).length > 0;
}, {
  message: 'Необходимо указать хотя бы одно поле для обновления',
  path: ['_errors']
});

/**
 * Типы на основе схем
 */
export type ProfileResponse = z.infer<typeof profileResponseSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>; 