import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker/locale/ru';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем заполнение базы данных тестовыми взаимодействиями...');
  
  // Получаем всех пользователей и маршруты
  const users = await prisma.user.findMany();
  const routes = await prisma.route.findMany();
  
  if (users.length === 0 || routes.length === 0) {
    console.error('❌ Сначала необходимо заполнить базу данных пользователями и маршрутами!');
    return;
  }
  
  console.log(`📊 Найдено ${users.length} пользователей и ${routes.length} маршрутов`);
  
  // Очищаем существующие данные
  await prisma.comment.deleteMany({});
  await prisma.like.deleteMany({});
  await prisma.favorite.deleteMany({});
  
  console.log('🗑️ Существующие данные очищены');
  
  // Создание комментариев (1-й уровень)
  const totalComments = 150;
  const rootComments = [];
  
  console.log(`💬 Создаем ${totalComments} основных комментариев...`);
  
  for (let i = 0; i < totalComments; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRoute = routes[Math.floor(Math.random() * routes.length)];
    
    const comment = await prisma.comment.create({
      data: {
        text: faker.lorem.paragraph(),
        userId: randomUser.id,
        routeId: randomRoute.id,
      },
    });
    
    rootComments.push(comment);
  }
  
  // Создание ответов на комментарии (2-й уровень)
  console.log('💬 Создаем ответы на комментарии...');
  
  for (const rootComment of rootComments) {
    // 40% шанс получить ответ
    if (Math.random() < 0.4) {
      const repliesCount = Math.floor(Math.random() * 3) + 1; // 1-3 ответа
      
      for (let i = 0; i < repliesCount; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        
        await prisma.comment.create({
          data: {
            text: faker.lorem.sentences({ min: 1, max: 3 }),
            userId: randomUser.id,
            routeId: rootComment.routeId,
            parentId: rootComment.id,
          },
        });
      }
    }
  }
  
  // Создание лайков
  console.log('👍 Создаем лайки для маршрутов...');
  
  const likesData = [];
  
  for (const route of routes) {
    // Определяем случайное количество лайков для маршрута (от 0 до 70% всех пользователей)
    const likesCount = Math.floor(Math.random() * (users.length * 0.7));
    const shuffledUsers = [...users].sort(() => 0.5 - Math.random());
    
    // Берем первые likesCount пользователей для лайков
    const usersWhoLike = shuffledUsers.slice(0, likesCount);
    
    for (const user of usersWhoLike) {
      likesData.push({
        userId: user.id,
        routeId: route.id,
      });
    }
    
    // Обновляем счетчик лайков в самом маршруте
    await prisma.route.update({
      where: { id: route.id },
      data: { likesCount }
    });
  }
  
  // Создаем лайки пакетно
  await prisma.like.createMany({
    data: likesData,
    skipDuplicates: true,
  });
  
  // Создание избранных
  console.log('⭐ Создаем избранные маршруты...');
  
  const favoritesData = [];
  
  for (const user of users) {
    // Определяем случайное количество избранных маршрутов для пользователя (от 0 до 30% всех маршрутов)
    const favoritesCount = Math.floor(Math.random() * (routes.length * 0.3));
    const shuffledRoutes = [...routes].sort(() => 0.5 - Math.random());
    
    // Берем первые favoritesCount маршрутов для избранного
    const favoriteRoutes = shuffledRoutes.slice(0, favoritesCount);
    
    for (const route of favoriteRoutes) {
      favoritesData.push({
        userId: user.id,
        routeId: route.id,
      });
    }
  }
  
  // Создаем избранные пакетно
  await prisma.favorite.createMany({
    data: favoritesData,
    skipDuplicates: true,
  });
  
  // Выводим статистику
  const commentsCount = await prisma.comment.count();
  const likesCount = await prisma.like.count();
  const favoritesCount = await prisma.favorite.count();
  
  console.log('✅ Заполнение базы данных тестовыми взаимодействиями завершено!');
  console.log(`📊 Создано:
  - ${commentsCount} комментариев
  - ${likesCount} лайков
  - ${favoritesCount} добавлений в избранное`);
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при заполнении базы данных:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 