import React from 'react';
import ReactDOM from 'react-dom';

// Определяем интерфейс для Yandex Maps API
interface YMaps3 {
  import: (module: string) => Promise<any>;
  ready: Promise<void>;
  // Добавим другие возможные свойства и методы
  [key: string]: unknown;
}

// Объявляем типы для Яндекс карт
declare global {
  interface Window {
    ymaps3: YMaps3;
  }
}

// Определяем типы для компонентов карт
type YMapProps = {
  location: any;
  mode: "vector" | "raster";
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
};

type YMapLayerProps = {
  [key: string]: any;
};

type YMapMarkerProps = {
  coordinates: [number, number];
  children?: React.ReactNode;
  [key: string]: any;
};

// Интерфейс для возвращаемого объекта
export interface YMapsComponents {
  reactify: {
    useDefault: <T>(value: T, deps?: unknown[]) => T;
    module: <T>(module: unknown) => T;
    entity: <T>(entity: unknown) => React.ComponentType<T>;
  };
  YMap: React.ComponentType<YMapProps>;
  YMapDefaultSchemeLayer: React.ComponentType<YMapLayerProps>;
  YMapDefaultFeaturesLayer: React.ComponentType<YMapLayerProps>;
  YMapMarker: React.ComponentType<YMapMarkerProps>;
}

// Функция для инициализации Яндекс Карт
export async function initYMaps(): Promise<YMapsComponents | null> {
  if (!window.ymaps3) {
    console.error('Yandex Maps API not loaded');
    return null;
  }

  try {
    const [ymaps3React] = await Promise.all([
      window.ymaps3.import('@yandex/ymaps3-reactify'),
      window.ymaps3.ready
    ]);

    const reactify = ymaps3React.reactify.bindTo(React, ReactDOM);
    const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker } = reactify.module(window.ymaps3);

    return {
      reactify,
      YMap,
      YMapDefaultSchemeLayer,
      YMapDefaultFeaturesLayer,
      YMapMarker
    };
  } catch (error) {
    console.error('Error initializing Yandex Maps:', error);
    return null;
  }
} 