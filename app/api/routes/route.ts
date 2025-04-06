import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  tags: z.string().optional().transform(tags => tags?.split(',').filter(Boolean)),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
      tags: searchParams.get('tags') || '',
    };
    console.log(params);
    const validatedParams = QuerySchema.parse(params);

    const { page, limit, tags } = validatedParams;
    const skip = (page - 1) * limit;

    const where = tags?.length ? {
      tags: {
        hasSome: tags,
      },
    } : {};

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        skip,
        take: limit,
        where: where as Prisma.RouteWhereInput,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.route.count({ where: where as Prisma.RouteWhereInput }),
    ]);

    // Формируем метаданные для пагинации
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      routes,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 