import { PrismaClient } from '@prisma/client';
import { RecommendationService } from '../../src/lib/services/recommendation.service';

// Установка переменных окружения перед импортом сервиса
process.env.RECOMMENDATION_API_URL = process.env.RECOMMENDATION_API_URL || 'http://localhost:8001';
process.env.RECOMMENDATION_COLLECTION = process.env.RECOMMENDATION_COLLECTION || 'tourchromadb';

const prisma = new PrismaClient();
const recommendationService = new RecommendationService();

async function seedRecommendations() {
  try {
    console.log('Starting recommendations seeding...');
    console.log(`Using API URL: ${process.env.RECOMMENDATION_API_URL}`);
    console.log(`Using collection: ${process.env.RECOMMENDATION_COLLECTION}`);

    // Получаем все маршруты из базы
    const routes = await prisma.route.findMany({
      select: {
        id: true,
        tags: true,
      },
    });

    console.log(`Found ${routes.length} routes to process`);

    // Добавляем каждый маршрут в рекомендательную систему
    for (const route of routes) {
      try {
        await recommendationService.addRoute(route.id, route.tags);
        console.log(`Added route ${route.id} with tags: ${route.tags.join(', ')}`);
      } catch (error) {
        console.error(`Error adding route ${route.id}:`, error);
      }
    }

    console.log('Recommendations seeding completed successfully');
  } catch (error) {
    console.error('Error during recommendations seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Запускаем скрипт
seedRecommendations(); 