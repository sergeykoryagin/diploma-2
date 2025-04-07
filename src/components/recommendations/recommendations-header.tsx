'use client';

import Link from 'next/link';

type ViewMode = 'list' | 'map';

type RecommendationsHeaderProps = {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
};

export default function RecommendationsHeader({ viewMode, setViewMode }: RecommendationsHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Рекомендации для вас</h1>
          <p className="text-gray-500">
            Маршруты, подобранные на основе ваших интересов
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Лента
              </span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Карта
              </span>
            </button>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Поиск маршрутов
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            Настроить интересы
          </Link>
        </div>
      </div>
    </div>
  );
} 