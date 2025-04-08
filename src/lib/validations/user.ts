import { z } from 'zod';

/**
 * Паттерн для имени - минимум 2 символа, максимум 50
 */
export const nameSchema = z
  .string()
  .trim()
  .min(2, { message: 'Имя должно содержать минимум 2 символа' })
  .max(50, { message: 'Имя должно содержать максимум 50 символов' });

/**
 * Паттерн для email
 */
export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Введите корректный email адрес' })
  .max(100, { message: 'Email должен содержать максимум 100 символов' });

/**
 * Схема для тега - строка с ограничениями
 */
export const tagSchema = z
  .string()
  .trim()
  .min(2, { message: 'Тег должен содержать минимум 2 символа' })
  .max(50, { message: 'Тег должен содержать максимум 50 символов' })
  .refine(tag => /^[a-zA-Zа-яА-Я0-9\-_\s]+$/.test(tag), {
    message: 'Тег может содержать только буквы, цифры, дефис, подчеркивание и пробелы'
  });

/**
 * Схема для массива тегов
 */
export const tagsSchema = z
  .array(tagSchema)
  .max(20, { message: 'Максимальное количество тегов - 20' });

// Схема для запроса на добавление тегов
export const addTagsSchema = z.object({
  tags: tagsSchema
}).refine(data => data.tags.length > 0, {
  message: 'Необходимо указать хотя бы один тег',
  path: ['tags']
});

// Схема для запроса на замену тегов
export const replaceTagsSchema = z.object({
  tags: tagsSchema
}).refine(data => data.tags.length > 0, {
  message: 'Необходимо указать хотя бы один тег',
  path: ['tags']
});

// Схема для URL параметров удаления тегов
export const deleteTagsParamsSchema = z.object({
  tags: z.string().min(1, { 
    message: 'Необходимо указать хотя бы один тег для удаления' 
  })
});

// Схема для обновления профиля - все поля опциональные
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

// Типы, основанные на схемах
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddTagsInput = z.infer<typeof addTagsSchema>;
export type ReplaceTagsInput = z.infer<typeof replaceTagsSchema>; 