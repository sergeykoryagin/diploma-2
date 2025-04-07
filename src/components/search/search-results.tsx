'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RouteCard from '@/components/routes/route-card';
import Pagination from '@/components/shared/pagination';
import LoadingSpinner from '@/components/shared/loading-spinner';

type Route = {
  id: string;
  title: string;
  description: string | null;
  tags: string[];
  author: {
    id: string;
    name: string;
    image: string;
  };
};

type SearchResponse = {
  routes: Route[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
};

type SearchResultsProps = {
  query: string;
};

export default function SearchResults({ query }: SearchResultsProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');

  const [data, setData] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query) {
        setData(null);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Не удалось выполнить поиск');
        }
        
        const data = await response.json();
        setData(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchSearchResults();
  }, [query, page, limit]);

  // Если поисковый запрос пустой и нет данных
  if (!query) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">
          Введите поисковый запрос для поиска маршрутов
        </p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!data || data.routes.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium mb-2">Нет результатов</h3>
        <p className="text-gray-500">
          По запросу "{query}" ничего не найдено. Попробуйте изменить запрос.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-medium">
          Результаты поиска по запросу "{query}"
        </h2>
        <p className="text-gray-500">
          Найдено {data.metadata.total} маршрутов
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {data.routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
      
      <Pagination
        currentPage={data.metadata.page}
        totalPages={data.metadata.totalPages}
        hasNextPage={data.metadata.hasNext}
        hasPrevPage={data.metadata.hasPrev}
      />
    </div>
  );
} 