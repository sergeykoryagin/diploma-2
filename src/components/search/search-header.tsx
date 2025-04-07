'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type SearchHeaderProps = {
  initialQuery: string;
};

export default function SearchHeader({ initialQuery }: SearchHeaderProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Поиск маршрутов</h1>
          <p className="text-gray-500">
            Найдите интересные маршруты по ключевым словам
          </p>
        </div>
        <div>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
          >
            Мои рекомендации
          </Link>
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex w-full">
        <input
          type="text"
          placeholder="Введите запрос для поиска маршрутов..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow px-4 py-3 border border-gray-300 rounded-l-md focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Поиск
        </button>
      </form>
    </div>
  );
} 