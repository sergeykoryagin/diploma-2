import { z } from 'zod';
import { tagsSchema } from '@/lib/validations/user';

/**
 * Схема для запроса на добавление тегов
 */
export const addTagsSchema = z.object({
  tags: tagsSchema
}).refine(data => data.tags.length > 0, {
  message: 'Необходимо указать хотя бы один тег',
  path: ['tags']
});

/**
 * Схема для запроса на замену тегов
 */
export const replaceTagsSchema = z.object({
  tags: tagsSchema
}).refine(data => data.tags.length > 0, {
  message: 'Необходимо указать хотя бы один тег',
  path: ['tags']
});

/**
 * Схема для URL параметров удаления тегов
 */
export const deleteTagsParamsSchema = z.object({
  tags: z.string().min(1, { 
    message: 'Необходимо указать хотя бы один тег для удаления' 
  })
});

/**
 * Схема для ответа API тегов
 */
export const tagsResponseSchema = z.object({
  tags: z.array(z.string()),
  updatedAt: z.date(),
  removedTags: z.array(z.string()).optional()
});

/**
 * Типы на основе схем
 */
export type AddTagsInput = z.infer<typeof addTagsSchema>;
export type ReplaceTagsInput = z.infer<typeof replaceTagsSchema>;
export type DeleteTagsParams = z.infer<typeof deleteTagsParamsSchema>;
export type TagsResponse = z.infer<typeof tagsResponseSchema>; 