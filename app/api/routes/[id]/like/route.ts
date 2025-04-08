import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { InteractionService } from '@/lib/services/interaction.service';

// GET - получение статуса лайка
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      // Для неавторизованного пользователя возвращаем только количество лайков
      const route = await InteractionService.getLikeStatus('', routeId);
      return NextResponse.json({ liked: false, count: route.count });
    }
    
    const likeStatus = await InteractionService.getLikeStatus(session.user.id, routeId);
    return NextResponse.json(likeStatus);
  } catch (error) {
    console.error('Error fetching like status:', error);
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - лайк/анлайк маршрута
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    const likeStatus = await InteractionService.toggleLike(session.user.id, routeId);
    return NextResponse.json(likeStatus);
  } catch (error) {
    console.error('Error toggling like:', error);
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 