import type { PaginationMetadata, Author } from '@/lib/api/schemas/common';

/**
 * Координаты на карте: [широта, долгота]
 */
export type Coordinates = [number, number];

/**
 * Ошибка API
 */
export type ApiError = {
  error: string;
  details?: Record<string, any>;
};

/**
 * Стандартный ответ с сообщением
 */
export type MessageResponse = {
  message: string;
};

// Реэкспорт типов из схем
export type { PaginationMetadata, Author }; 