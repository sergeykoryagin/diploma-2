import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ZodError } from 'zod';
import { UserService } from '@/lib/services/user.service';
import { 
  addTagsSchema, 
  replaceTagsSchema, 
  deleteTagsParamsSchema
} from '@/lib/api/schemas/tags';

// GET - получение тегов текущего пользователя
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ tags: user.tags });
  } catch (error) {
    console.error('Error in GET /api/profile/tags:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PUT - замена всех тегов пользователя
export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Получаем и валидируем данные с использованием схемы replaceTagsSchema
    const requestData = await request.json();
    const { tags } = replaceTagsSchema.parse(requestData);
    
    // Обновляем теги пользователя
    const updatedUser = await UserService.updateUserTags(user.id, tags);
    
    // Возвращаем обновленные данные
    return NextResponse.json({ 
      tags: updatedUser.tags,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/tags:', error);
    
    // Обработка ошибок валидации Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Ошибка валидации тегов',
          details: error.format()
        },
        { status: 400 }
      );
    }
    
    // Обработка других ошибок
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PATCH - добавление новых тегов к существующим
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Получаем и валидируем данные с использованием схемы addTagsSchema
    const requestData = await request.json();
    const { tags: newTags } = addTagsSchema.parse(requestData);
    
    // Объединяем существующие и новые теги, удаляя дубликаты
    const combinedTags = Array.from(new Set([...user.tags, ...newTags]));
    
    // Проверяем, не превышает ли общее количество лимит
    // Это уже проверено в tagsSchema, но на всякий случай проверим еще раз
    if (combinedTags.length > 20) {
      return NextResponse.json(
        { error: 'Превышен лимит тегов (максимум 20)' },
        { status: 400 }
      );
    }
    
    // Обновляем теги пользователя
    const updatedUser = await UserService.updateUserTags(user.id, combinedTags);
    
    // Возвращаем обновленные данные
    return NextResponse.json({ 
      tags: updatedUser.tags,
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error('Error in PATCH /api/profile/tags:', error);
    
    // Обработка ошибок валидации Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Ошибка валидации тегов',
          details: error.format()
        },
        { status: 400 }
      );
    }
    
    // Обработка других ошибок
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// DELETE - удаление определенных тегов
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      );
    }
    
    const user = await UserService.getUserByEmail(session.user.email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      );
    }
    
    // Получаем и валидируем URL параметры
    const { searchParams } = new URL(request.url);
    const tagsParam = searchParams.get('tags') || '';
    
    // Валидируем параметр tags
    deleteTagsParamsSchema.parse({ tags: tagsParam });
    
    // Разбиваем строку тегов на массив
    const tagsToRemove = tagsParam.split(',');
    
    // Фильтруем существующие теги
    const updatedTags = user.tags.filter(tag => !tagsToRemove.includes(tag));
    
    // Обновляем теги пользователя
    const updatedUser = await UserService.updateUserTags(user.id, updatedTags);
    
    // Возвращаем обновленные данные
    return NextResponse.json({ 
      tags: updatedUser.tags,
      removedTags: user.tags.filter(tag => tagsToRemove.includes(tag)),
      updatedAt: updatedUser.updatedAt
    });
  } catch (error) {
    console.error('Error in DELETE /api/profile/tags:', error);
    
    // Обработка ошибок валидации Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Ошибка валидации параметров',
          details: error.format()
        },
        { status: 400 }
      );
    }
    
    // Обработка других ошибок
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 