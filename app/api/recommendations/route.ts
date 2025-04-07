import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { recommendationService } from '@/lib/services/recommendation.service';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(10),
  page: z.coerce.number().min(1).default(1),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const { limit, page } = querySchema.parse({
      limit: searchParams.get('limit'),
      page: searchParams.get('page'),
    });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { tags: true },
    });

    if (!user || !user.tags.length) {
      return getLatestRoutes(limit, page);
    }

    const recommendedIds = await recommendationService.getRecommendationsByTags(user.tags, limit);
    
    if (!recommendedIds.length) {
      return getLatestRoutes(limit, page);
    }

    const skip = (page - 1) * limit;
    const take = limit;

    const [routes, total] = await Promise.all([
      prisma.route.findMany({
        where: { id: { in: recommendedIds } },
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
        where: { id: { in: recommendedIds } },
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
    console.error('Error fetching recommendations:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getLatestRoutes(limit: number, page: number) {
  const skip = (page - 1) * limit;
  
  const [routes, total] = await Promise.all([
    prisma.route.findMany({
      skip,
      take: limit,
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
    prisma.route.count(),
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
} 