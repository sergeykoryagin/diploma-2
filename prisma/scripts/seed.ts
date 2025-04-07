import { PrismaClient } from '@prisma/client';
import { getRandomTags } from '../mock-tags';

const prisma = new PrismaClient();

// Популярные места в Казани
const KAZAN_LANDMARKS = [
  // Достопримечательности
  { name: "Казанский Кремль", lat: 55.7989, lng: 49.1058, type: "достопримечательность" },
  { name: "Мечеть Кул-Шариф", lat: 55.7984, lng: 49.1050, type: "достопримечательность" },
  { name: "Центр семьи Казан", lat: 55.7419, lng: 49.1233, type: "достопримечательность" },
  { name: "Дворец земледельцев", lat: 55.8008, lng: 49.1019, type: "достопримечательность" },
  { name: "Храм всех религий", lat: 55.7728, lng: 48.9714, type: "достопримечательность" },
  { name: "Башня Сююмбике", lat: 55.7986, lng: 49.1062, type: "достопримечательность" },
  { name: "Благовещенский собор", lat: 55.7982, lng: 49.1068, type: "достопримечательность" },
  { name: "Петропавловский собор", lat: 55.7925, lng: 49.1208, type: "достопримечательность" },
  { name: "Памятник Мусе Джалилю", lat: 55.7956, lng: 49.1156, type: "достопримечательность" },
  
  // Улицы и районы
  { name: "Улица Баумана", lat: 55.7868, lng: 49.1233, type: "улица" },
  { name: "Старо-Татарская слобода", lat: 55.7780, lng: 49.1150, type: "район" },
  { name: "Кремлевская набережная", lat: 55.8005, lng: 49.1055, type: "улица" },
  { name: "Улица Кремлевская", lat: 55.7920, lng: 49.1180, type: "улица" },
  { name: "Проспект Чистопольская", lat: 55.8190, lng: 49.1310, type: "улица" },
  { name: "Улица Петербургская", lat: 55.7860, lng: 49.1310, type: "улица" },
  
  // Парки и скверы
  { name: "Парк Тысячелетия", lat: 55.7827, lng: 49.1207, type: "парк" },
  { name: "Парк Горького", lat: 55.7968, lng: 49.1494, type: "парк" },
  { name: "Парк Черное озеро", lat: 55.7950, lng: 49.1300, type: "парк" },
  { name: "Сквер Баки Урманче", lat: 55.7880, lng: 49.1390, type: "парк" },
  { name: "Лядской сад", lat: 55.7870, lng: 49.1360, type: "парк" },
  { name: "Парк Урицкого", lat: 55.8350, lng: 49.0820, type: "парк" },
  { name: "Сквер Тукая", lat: 55.7840, lng: 49.1220, type: "парк" },
  
  // Водоемы
  { name: "Озеро Кабан", lat: 55.7705, lng: 49.1390, type: "водоем" },
  { name: "Набережная реки Казанки", lat: 55.8053, lng: 49.1050, type: "водоем" },
  { name: "Голубые озера", lat: 55.8500, lng: 48.9000, type: "водоем" },
  
  // Образование и культура
  { name: "Казанский университет", lat: 55.7903, lng: 49.1214, type: "образование" },
  { name: "Казанская Ратуша", lat: 55.7960, lng: 49.1145, type: "культура" },
  { name: "Национальный музей РТ", lat: 55.7980, lng: 49.1060, type: "музей" },
  { name: "Музей естественной истории", lat: 55.7905, lng: 49.1220, type: "музей" },
  { name: "Музей иллюзий", lat: 55.7870, lng: 49.1240, type: "музей" },
  { name: "Музей чак-чака", lat: 55.7790, lng: 49.1150, type: "музей" },
  { name: "Музей советских игровых автоматов", lat: 55.7860, lng: 49.1230, type: "музей" },
  
  // Театры
  { name: "Театр оперы и балета", lat: 55.7863, lng: 49.1436, type: "театр" },
  { name: "Татарский театр Камала", lat: 55.7820, lng: 49.1150, type: "театр" },
  { name: "Театр кукол Экият", lat: 55.7830, lng: 49.1470, type: "театр" },
  { name: "Театр драмы и комедии", lat: 55.7890, lng: 49.1410, type: "театр" },
  { name: "Театр Тинчурина", lat: 55.7650, lng: 49.2150, type: "театр" },
  { name: "Молодежный театр на Булаке", lat: 55.7880, lng: 49.1190, type: "театр" },
  
  // Развлечения
  { name: "Аквапарк Ривьера", lat: 55.8182, lng: 49.1082, type: "развлечение" },
  { name: "Казанский цирк", lat: 55.7920, lng: 49.1350, type: "развлечение" },
  { name: "Колесо обозрения Вокруг света", lat: 55.8200, lng: 49.1080, type: "развлечение" },
  { name: "Парк аттракционов Кырлай", lat: 55.8230, lng: 49.1090, type: "развлечение" },
  { name: "Планетарий КФУ", lat: 55.7910, lng: 49.1220, type: "развлечение" },
  
  // Торговые центры
  { name: "ТЦ Кольцо", lat: 55.7870, lng: 49.1240, type: "шоппинг" },
  { name: "ТРК Корстон", lat: 55.7670, lng: 49.1390, type: "шоппинг" },
  { name: "ТЦ Мега", lat: 55.7500, lng: 49.2140, type: "шоппинг" },
  { name: "ТЦ ГУМ", lat: 55.7880, lng: 49.1220, type: "шоппинг" },
  { name: "ТЦ Республика", lat: 55.7890, lng: 49.1390, type: "шоппинг" },
  
  // Рестораны
  { name: "Ресторан Дом татарской кулинарии", lat: 55.7860, lng: 49.1240, type: "ресторан" },
  { name: "Ресторан Туган Авылым", lat: 55.7870, lng: 49.1250, type: "ресторан" },
  { name: "Ресторан Пашмир", lat: 55.7880, lng: 49.1260, type: "ресторан" },
  { name: "Ресторан Биляр", lat: 55.7890, lng: 49.1270, type: "ресторан" },
  { name: "Ресторан Татарская усадьба", lat: 55.7900, lng: 49.1280, type: "ресторан" },
  { name: "Ресторан Чирэм", lat: 55.7910, lng: 49.1290, type: "ресторан" },
  { name: "Ресторан Сказка", lat: 55.7920, lng: 49.1300, type: "ресторан" },
  { name: "Ресторан Панорама", lat: 55.7930, lng: 49.1310, type: "ресторан" },
  { name: "Ресторан Приют холостяка", lat: 55.7940, lng: 49.1320, type: "ресторан" },
  { name: "Ресторан Парус", lat: 55.7950, lng: 49.1330, type: "ресторан" },
  
  // Кафе
  { name: "Кафе Чак-чак", lat: 55.7790, lng: 49.1150, type: "кафе" },
  { name: "Кафе Эчпочмак", lat: 55.7800, lng: 49.1160, type: "кафе" },
  { name: "Кафе Сабантуй", lat: 55.7810, lng: 49.1170, type: "кафе" },
  { name: "Кафе Чайхана", lat: 55.7820, lng: 49.1180, type: "кафе" },
  { name: "Кафе Бахетле", lat: 55.7830, lng: 49.1190, type: "кафе" },
  { name: "Кафе Добрая столовая", lat: 55.7840, lng: 49.1200, type: "кафе" },
  { name: "Кафе Тюбетей", lat: 55.7850, lng: 49.1210, type: "кафе" },
  { name: "Кафе Халяль", lat: 55.7860, lng: 49.1220, type: "кафе" },
  { name: "Кафе Биляр", lat: 55.7870, lng: 49.1230, type: "кафе" },
  { name: "Кафе Татарские сладости", lat: 55.7880, lng: 49.1240, type: "кафе" },
  
  // Бары
  { name: "Бар The Legend", lat: 55.7890, lng: 49.1250, type: "бар" },
  { name: "Бар Соль", lat: 55.7900, lng: 49.1260, type: "бар" },
  { name: "Бар Fomin", lat: 55.7910, lng: 49.1270, type: "бар" },
  { name: "Бар Культура", lat: 55.7920, lng: 49.1280, type: "бар" },
  { name: "Бар Угол", lat: 55.7930, lng: 49.1290, type: "бар" },
  { name: "Бар Neft", lat: 55.7940, lng: 49.1300, type: "бар" },
  { name: "Бар Коробка", lat: 55.7950, lng: 49.1310, type: "бар" },
  { name: "Бар Волна", lat: 55.7960, lng: 49.1320, type: "бар" },
  { name: "Бар Соседи", lat: 55.7970, lng: 49.1330, type: "бар" },
  { name: "Бар Тринити", lat: 55.7980, lng: 49.1340, type: "бар" },
  
  // Спортивные объекты
  { name: "Стадион Казань Арена", lat: 55.8220, lng: 49.1600, type: "спорт" },
  { name: "Дворец водных видов спорта", lat: 55.7820, lng: 49.1500, type: "спорт" },
  { name: "Центр гимнастики", lat: 55.7830, lng: 49.1510, type: "спорт" },
  { name: "Баскет-холл", lat: 55.7840, lng: 49.1520, type: "спорт" },
  { name: "Ледовый дворец Татнефть Арена", lat: 55.8210, lng: 49.1580, type: "спорт" }
];

// Генерация случайного маршрута
function generateRandomRoute(userId: string) {
  // Количество точек в маршруте (от 1 до 7)
  const pointsCount = Math.floor(Math.random() * 7) + 1;
  
  // Выбираем случайную начальную точку
  const startLandmarkIndex = Math.floor(Math.random() * KAZAN_LANDMARKS.length);
  const startLandmark = KAZAN_LANDMARKS[startLandmarkIndex];
  
  // Выбираем случайные теги для маршрута (от 1 до 5)
  const routeTags = getRandomTags();
  
  // Генерируем название маршрута с учетом типа начальной точки
  const routeTypes = [
    "Прогулка по", "Экскурсия по", "Тур по", "Маршрут по", "Путешествие по", 
    "Знакомство с", "Исследование", "Открытие", "Визит в", "Поездка по"
  ];
  
  const routeAreas = [
    "центру Казани", "историческим местам", "культурным достопримечательностям", 
    "паркам и скверам", "архитектурным памятникам", "музеям", "живописным местам",
    "уютным уголкам", "знаковым местам", "туристическим местам"
  ];
  
  // Добавляем специфичные названия в зависимости от тегов
  if (routeTags.includes('ресторан') || routeTags.includes('кафе') || routeTags.includes('бар')) {
    routeAreas.push("гастрономическим местам", "кулинарным достопримечательностям", "лучшим ресторанам", "уютным кафе");
  }
  
  if (routeTags.includes('музей') || routeTags.includes('галерея') || routeTags.includes('выставка')) {
    routeAreas.push("музеям и галереям", "культурным центрам", "выставочным залам");
  }
  
  if (routeTags.includes('парк') || routeTags.includes('набережная')) {
    routeAreas.push("зеленым зонам", "паркам и скверам", "местам отдыха на природе");
  }
  
  if (routeTags.includes('театр') || routeTags.includes('концерт')) {
    routeAreas.push("театрам и концертным площадкам", "культурным заведениям");
  }
  
  const routeType = routeTypes[Math.floor(Math.random() * routeTypes.length)];
  const routeArea = routeAreas[Math.floor(Math.random() * routeAreas.length)];
  const title = `${routeType} ${routeArea}`;
  
  // Генерируем описание маршрута с учетом типа начальной точки и тегов
  let descriptions = [
    `Отличный маршрут для знакомства с ${routeArea}. Начинается у ${startLandmark.name}.`,
    `Идеальный вариант для выходного дня. Посетите ${startLandmark.name} и другие интересные места.`,
    `Популярный туристический маршрут, включающий ${startLandmark.name} и другие достопримечательности.`,
    `Маршрут для любителей истории и архитектуры. Начните с ${startLandmark.name}.`,
    `Живописный путь через самые красивые места, включая ${startLandmark.name}.`,
    `Короткий, но насыщенный маршрут с посещением ${startLandmark.name}.`,
    `Для тех, кто хочет увидеть настоящую Казань. Обязательно посетите ${startLandmark.name}.`,
    `Маршрут выходного дня с остановкой у ${startLandmark.name} и других интересных мест.`,
    `Познавательная прогулка с началом у ${startLandmark.name}.`,
    `Семейный маршрут с посещением ${startLandmark.name} и других достопримечательностей.`
  ];
  
  // Добавляем специфичные описания в зависимости от типа начальной точки
  if (startLandmark.type === 'ресторан' || startLandmark.type === 'кафе' || startLandmark.type === 'бар') {
    descriptions = descriptions.concat([
      `Гастрономический тур, начинающийся с ${startLandmark.name}. Попробуйте лучшие блюда татарской кухни.`,
      `Кулинарное путешествие по Казани. Первая остановка - ${startLandmark.name}.`,
      `Маршрут для гурманов с посещением ${startLandmark.name} и других вкусных мест.`
    ]);
  }
  
  if (startLandmark.type === 'музей' || startLandmark.type === 'театр') {
    descriptions = descriptions.concat([
      `Культурный маршрут, включающий посещение ${startLandmark.name} и других культурных объектов.`,
      `Для ценителей искусства: начните с ${startLandmark.name} и продолжите знакомство с культурной жизнью Казани.`,
      `Погрузитесь в мир искусства, начав с ${startLandmark.name}.`
    ]);
  }
  
  if (startLandmark.type === 'парк' || startLandmark.type === 'водоем') {
    descriptions = descriptions.concat([
      `Маршрут для любителей природы. Начните с ${startLandmark.name} и насладитесь зелеными уголками Казани.`,
      `Отдохните от городской суеты, посетив ${startLandmark.name} и другие живописные места.`,
      `Экологический маршрут с первой остановкой в ${startLandmark.name}.`
    ]);
  }
  
  if (startLandmark.type === 'достопримечательность') {
    descriptions = descriptions.concat([
      `Классический туристический маршрут. Начните с ${startLandmark.name} - одной из главных достопримечательностей Казани.`,
      `Исторический тур с первой остановкой у ${startLandmark.name}.`,
      `Познакомьтесь с историей Казани, начав с ${startLandmark.name}.`
    ]);
  }
  
  if (startLandmark.type === 'спорт' || routeTags.includes('спорт')) {
    descriptions = descriptions.concat([
      `Спортивный маршрут, включающий посещение ${startLandmark.name} и других спортивных объектов Казани.`,
      `Для любителей спорта: начните с ${startLandmark.name} и посетите другие спортивные достопримечательности.`,
      `Активный маршрут с первой остановкой в ${startLandmark.name}.`
    ]);
  }
  
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Генерируем точки маршрута
  const points: {
    latitude: number;
    longitude: number;
    title: string;
    orderIndex: number;
  }[] = [];
  
  // Первая точка - выбранный ориентир
  points.push({
    latitude: startLandmark.lat,
    longitude: startLandmark.lng,
    title: startLandmark.name,
    orderIndex: 0
  });
  
  // Создаем массив для отслеживания уже использованных ориентиров
  const usedLandmarkIndices = [startLandmarkIndex];
  
  // Генерируем остальные точки
  for (let i = 1; i < pointsCount; i++) {
    // Выбираем следующую точку - либо другой ориентир, либо случайную точку рядом
    let nextPoint;
    
    if (Math.random() > 0.3) {
      // Выбираем другой ориентир, который еще не использовали
      let nextLandmarkIndex;
      let attempts = 0;
      const maxAttempts = 10;
      
      do {
        nextLandmarkIndex = Math.floor(Math.random() * KAZAN_LANDMARKS.length);
        attempts++;
        
        // Если не можем найти новый ориентир после нескольких попыток, выходим из цикла
        if (attempts > maxAttempts) break;
      } while (usedLandmarkIndices.includes(nextLandmarkIndex));
      
      // Если нашли новый ориентир, используем его
      if (!usedLandmarkIndices.includes(nextLandmarkIndex)) {
        const nextLandmark = KAZAN_LANDMARKS[nextLandmarkIndex];
        usedLandmarkIndices.push(nextLandmarkIndex);
        
        nextPoint = {
          latitude: nextLandmark.lat,
          longitude: nextLandmark.lng,
          title: nextLandmark.name,
          orderIndex: i
        };
      } else {
        // Иначе генерируем случайную точку
        const prevPoint = points[i - 1];
        const maxDelta = 0.01; // Максимальное отклонение (примерно 1 км)
        
        const lat = prevPoint.latitude + (Math.random() * 2 - 1) * maxDelta;
        const lng = prevPoint.longitude + (Math.random() * 2 - 1) * maxDelta;
        
        // Названия для случайных точек
        const pointNames = [
          "Смотровая площадка", "Кафе", "Сквер", "Памятник", "Фонтан", 
          "Магазин сувениров", "Музей", "Галерея", "Ресторан", "Парк",
          "Остановка", "Мост", "Переход", "Площадь", "Перекресток",
          "Уличное кафе", "Арт-объект", "Граффити", "Скульптура", "Мини-маркет"
        ];
        
        nextPoint = {
          latitude: lat,
          longitude: lng,
          title: pointNames[Math.floor(Math.random() * pointNames.length)],
          orderIndex: i
        };
      }
    } else {
      // Генерируем случайную точку недалеко от предыдущей
      const prevPoint = points[i - 1];
      const maxDelta = 0.01; // Максимальное отклонение (примерно 1 км)
      
      const lat = prevPoint.latitude + (Math.random() * 2 - 1) * maxDelta;
      const lng = prevPoint.longitude + (Math.random() * 2 - 1) * maxDelta;
      
      // Названия для случайных точек
      const pointNames = [
        "Смотровая площадка", "Кафе", "Сквер", "Памятник", "Фонтан", 
        "Магазин сувениров", "Музей", "Галерея", "Ресторан", "Парк",
        "Остановка", "Мост", "Переход", "Площадь", "Перекресток",
        "Уличное кафе", "Арт-объект", "Граффити", "Скульптура", "Мини-маркет"
      ];
      
      nextPoint = {
        latitude: lat,
        longitude: lng,
        title: pointNames[Math.floor(Math.random() * pointNames.length)],
        orderIndex: i
      };
    }
    
    points.push(nextPoint);
  }
  
  return {
    title,
    description,
    tags: routeTags,
    authorId: userId,
    points: {
      create: points
    }
  };
}

async function main() {
  // Создаем пользователей
  const users = [];
  for (let i = 1; i <= 100; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i}@example.com`,
        name: `Пользователь ${i}`,
        tags: getRandomTags(),  
      },
    });
    users.push(user);
  }
  
  console.log(`Создано ${users.length} пользователей`);
  
  // Создаем маршруты
  let routesCreated = 0;
  
  for (const user of users) {
    // Случайное количество маршрутов для каждого пользователя (от 5 до 15)
    const userRoutesCount = Math.floor(Math.random() * 11) + 5;
    
    for (let i = 0; i < userRoutesCount; i++) {
      const routeData = generateRandomRoute(user.id);
      await prisma.route.create({
        data: routeData
      });
      routesCreated++;
      
      if (routesCreated % 100 === 0) {
        console.log(`Создано ${routesCreated} маршрутов...`);
      }
    }
  }
  
  console.log(`Всего создано ${routesCreated} маршрутов с точками`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 