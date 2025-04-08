import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { recommendationService } from '@/lib/services/recommendation.service';
import { searchQuerySchema } from '@/lib/api/schemas/search';
import { ZodError } from 'zod';

// Функция для подготовки поискового запроса в формат для рекомендательной системы
function prepareSearchQuery(query: string): string {
  // Разбиваем запрос на слова, удаляем пустые и соединяем пробелами
  return query
    .split(/[\s,.;:!?]+/) // Разделяем по пробелам и знакам препинания
    .filter(word => word.length > 1) // Убираем короткие слова и пустые строки
    .join(' ');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = searchQuerySchema.parse({
      query: searchParams.get('query'),
      limit: searchParams.get('limit'),
      page: searchParams.get('page'),
    });

    const { query, limit, page } = params;
    
    if (!query) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }
  
    const formattedQuery = prepareSearchQuery(query);
    
    const searchIds = await recommendationService.searchRoutes(formattedQuery, limit);
    
    if (!searchIds.length) {
      return NextResponse.json({
        routes: [],
        metadata: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNext: false,
          hasPrev: page > 1,
        },
      });
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where: { id: { in: searchIds } },
        take,
        skip,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.route.count({
        where: { id: { in: searchIds } },
      }),
    ]);

    return NextResponse.json({
      routes,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error searching routes:', error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 