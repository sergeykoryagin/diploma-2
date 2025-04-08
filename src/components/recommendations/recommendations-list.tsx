'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import RouteCard from '@/components/routes/route-card';
import Pagination from '@/components/shared/pagination';
import LoadingSpinner from '@/components/shared/loading-spinner';
import MapView from './map-view';

type ViewMode = 'list' | 'map';

type RecommendationsListProps = {
  viewMode: ViewMode;
};

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
  coordinates?: [number, number];
};

type RecommendationsResponse = {
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

export default function RecommendationsList({ viewMode }: RecommendationsListProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const limit = Number(searchParams.get('limit') || '10');
  
  const [data, setData] = useState<RecommendationsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRecommendations() {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/recommendations?page=${page}&limit=${limit}`);
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить рекомендации');
        }
        
        const responseData = await response.json();
        
        // Координаты центра Казани
        const kazanCenter = [55.796127, 49.106414];
        
        const routesWithCoordinates = responseData.routes.map((route: Route) => ({
          ...route,
          coordinates: [
            kazanCenter[0] + (Math.random() - 0.5) * 0.2,
            kazanCenter[1] + (Math.random() - 0.5) * 0.1
          ] as [number, number]
        }));
        
        setData({
          ...responseData,
          routes: routesWithCoordinates
        });
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRecommendations();
  }, [page, limit]);

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
        <h3 className="text-lg font-medium mb-2">Нет рекомендаций</h3>
        <p className="text-gray-500 mb-4">
          Мы не нашли маршрутов, соответствующих вашим интересам.
          Попробуйте обновить ваши теги или вернуться позже.
        </p>
        <a 
          href="/profile" 
          className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Обновить интересы
        </a>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'list' ? (
        <div>
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
      ) : (
        <MapView routes={data.routes} />
      )}
    </>
  );
} 