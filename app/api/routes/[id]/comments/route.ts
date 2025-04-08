import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ZodError } from 'zod';
import { CommentService } from '@/lib/services/comment.service';
import { 
  commentsQuerySchema, 
  createCommentSchema 
} from '@/lib/api/schemas/comments';

// GET - получение комментариев для маршрута
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const { searchParams } = new URL(request.url);
    
    // Валидируем параметры запроса
    const { limit, page, parentId } = commentsQuerySchema.parse({
      limit: searchParams.get('limit'),
      page: searchParams.get('page'),
      parentId: searchParams.get('parentId') || undefined,
    });
    
    // Получаем комментарии
    const { comments, total } = await CommentService.getComments(
      routeId,
      page,
      limit,
      parentId
    );
    
    // Возвращаем комментарии с метаданными
    return NextResponse.json({
      comments,
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
    console.error('Error fetching comments:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Некорректные параметры запроса' }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 });
  }
}

// POST - создание нового комментария
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: routeId } = await params;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Получаем данные из запроса
    const requestData = await request.json();
    
    // Добавляем routeId из параметров маршрута
    const data = createCommentSchema.parse({
      ...requestData,
      routeId,
    });
    
    // Создаем комментарий
    const comment = await CommentService.createComment(session.user.id, data);
    
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: 'Ошибка валидации данных',
        details: error.format()
      }, { status: 400 });
    }
    
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 