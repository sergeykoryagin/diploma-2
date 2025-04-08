import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { InteractionService } from '@/lib/services/interaction.service';

// GET - получение статуса избранного
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { favorite: false, error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const favoriteStatus = await InteractionService.getFavoriteStatus(
      session.user.id,
      routeId
    );
    return NextResponse.json(favoriteStatus);
  } catch (error) {
    console.error('Error fetching favorite status:', error);
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST - добавление/удаление маршрута из избранного
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const favoriteStatus = await InteractionService.toggleFavorite(
      session.user.id,
      routeId
    );
    return NextResponse.json(favoriteStatus);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 