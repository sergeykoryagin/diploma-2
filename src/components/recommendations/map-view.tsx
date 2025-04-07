'use client';

import { useEffect, useState, useRef } from 'react';
import { initYMaps, YMapsComponents } from '@/lib/ymaps';
import LoadingSpinner from '@/components/shared/loading-spinner';

type MapViewProps = {
  routes: {
    id: string;
    title: string;
    description: string | null;
    tags: string[];
    author: {
      id: string;
      name: string;
      image: string;
    };
    coordinates?: [number, number];
  }[];
};

export default function MapView({ routes }: MapViewProps) {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [mapsComponents, setMapsComponents] = useState<YMapsComponents | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const metaRef = useRef<HTMLMetaElement | null>(null);

  // Центр Казани
  const defaultCenter = [49.106414, 55.796127];

  useEffect(() => {
    // Проверяем, существует ли уже мета-тег referrer
    const existingMeta = document.querySelector('meta[name="referrer"]');
    if (!existingMeta) {
      // Добавляем meta для домена
      const meta = document.createElement('meta');
      meta.name = 'referrer';
      meta.content = 'origin';
      document.head.appendChild(meta);
      metaRef.current = meta;
    }

    // Проверяем, загружен ли уже скрипт
    if (!window.ymaps3 && !document.querySelector('script[src*="api-maps.yandex.ru"]')) {
      // Добавляем API скрипт Яндекс Карт
      const script = document.createElement('script');
      
      // Используем ключ из .env
      const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY || '';
      script.src = `https://api-maps.yandex.ru/v3/?apikey=${apiKey}&lang=ru_RU`;
      script.async = true;
      
      script.onload = async () => {
        try {
          const mapsComponents = await initYMaps();
          if (mapsComponents) {
            setMapsComponents(mapsComponents);
            setMapsLoaded(true);
          } else {
            setMapsError('Не удалось инициализировать Яндекс Карты');
          }
        } catch (error) {
          setMapsError('Ошибка при загрузке карт');
          console.error('Map initialization error:', error);
        }
      };
      
      script.onerror = (e) => {
        console.error('Script loading error:', e);
        setMapsError('Не удалось загрузить Яндекс Карты. Проверьте доступность домена и API-ключ.');
      };

      document.head.appendChild(script);
      scriptRef.current = script;
    } else if (window.ymaps3) {
      // Если скрипт уже загружен, просто инициализируем
      initYMaps().then(mapsComponents => {
        if (mapsComponents) {
          setMapsComponents(mapsComponents);
          setMapsLoaded(true);
        } else {
          setMapsError('Не удалось инициализировать Яндекс Карты');
        }
      }).catch(error => {
        setMapsError('Ошибка при инициализации карт');
        console.error('Map initialization error:', error);
      });
    }
    
    return () => {
      // Удаляем только те элементы, которые мы добавили сами
      if (scriptRef.current && document.head.contains(scriptRef.current)) {
        document.head.removeChild(scriptRef.current);
      }
      if (metaRef.current && document.head.contains(metaRef.current)) {
        document.head.removeChild(metaRef.current);
      }
    };
  }, []);

  if (mapsError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-red-500 mb-4">{mapsError}</p>
        <p className="text-gray-500 mb-2">Используемый API-ключ: {process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY?.substring(0, 8)}...</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-button-primary hover:bg-button-primary-hover text-white rounded"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!mapsLoaded || !mapsComponents) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px]">
        <p className="mb-4">Загрузка карты...</p>
        <LoadingSpinner />
      </div>
    );
  }

  const { reactify, YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = mapsComponents;

  return (
    <div className="h-[600px] w-full bg-gray-100 rounded-lg overflow-hidden">
      <YMap 
        location={reactify.useDefault({
          center: defaultCenter,
          zoom: 12,
        })}
        mode="vector"
        className="w-full h-full"
      >
        <YMapDefaultSchemeLayer />
        <YMapDefaultFeaturesLayer />
        
        {routes.map((route) => {
          if (route.coordinates) {
            return (
              <YMapMarker 
                key={route.id}
                coordinates={reactify.useDefault(route.coordinates)}
              >
                <div className="bg-white p-2 rounded shadow-md">
                  <h3 className="text-sm font-semibold">{route.title}</h3>
                </div>
              </YMapMarker>
            );
          }
          return null;
        })}
      </YMap>
    </div>
  );
} 