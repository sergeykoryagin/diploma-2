import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { ZodError } from 'zod';
import { UserService } from '@/lib/services/user.service';
import { 
  profileResponseSchema, 
  updateProfileSchema
} from '@/lib/api/schemas/profile';

// GET - получение информации о текущем пользователе
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
    

    const safeUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image, 
      tags: user.tags,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    
    // Валидируем данные перед отправкой
    profileResponseSchema.parse(safeUserData);
    
    return NextResponse.json(safeUserData);
  } catch (error) {
    console.error('Error in GET /api/profile:', error);
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Ошибка формата данных', details: error.format() },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}

// PATCH - обновление профиля пользователя
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
    
    // Получаем данные из запроса (только JSON)
    const requestData = await request.json();
    
    // Валидируем данные с использованием схемы
    const validatedData = updateProfileSchema.parse(requestData);
    
    // Обновляем профиль пользователя
    const updatedUser = await UserService.updateProfile(user.id, validatedData);
    
    // Подготавливаем ответ
    const response = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      image: updatedUser.image, // изображение из Яндекса
      tags: updatedUser.tags,
      updatedAt: updatedUser.updatedAt,
    };
    
    // Валидируем ответ перед отправкой
    profileResponseSchema.parse(response);
    
    // Возвращаем обновленные данные
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in PATCH /api/profile:', error);
    
    // Обработка ошибок валидации Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: 'Ошибка валидации данных',
          details: error.format()
        },
        { status: 400 }
      );
    }
    
    // Обработка ошибки уникальности email
    if (error instanceof Error && error.message.includes('уже существует')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    
    // Обработка других ошибок
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
} 