import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ZodError } from 'zod';
import { CommentService } from '@/lib/services/comment.service';
import { updateCommentSchema } from '@/lib/api/schemas/comments';

// PATCH - обновление комментария
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Получаем данные из запроса
    const requestData = await request.json();
    
    // Валидируем данные
    const data = updateCommentSchema.parse(requestData);
    
    // Обновляем комментарий
    const comment = await CommentService.updateComment(
      commentId,
      session.user.id,
      data
    );
    
    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json({ 
        error: 'Ошибка валидации данных',
        details: error.format()
      }, { status: 400 });
    }
    
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    const status = error instanceof Error && error.message.includes('У вас нет прав') ? 403 : 500;
    
    return NextResponse.json({ error: message }, { status });
  }
}

// DELETE - удаление комментария
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const commentId = params.id;
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 });
    }
    
    // Удаляем комментарий
    await CommentService.deleteComment(commentId, session.user.id);
    
    return NextResponse.json({ message: 'Комментарий удален' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    
    const message = error instanceof Error ? error.message : 'Внутренняя ошибка сервера';
    const status = error instanceof Error && error.message.includes('У вас нет прав') ? 403 : 500;
    
    return NextResponse.json({ error: message }, { status });
  }
} 