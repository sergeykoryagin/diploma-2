'use client';

import Link from 'next/link';
import Image from 'next/image';

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

type RouteCardProps = {
  route: Route;
};

export default function RouteCard({ route }: RouteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition duration-300">
      <Link href={`/routes/${route.id}`} className="block">
        <div className="p-5">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">
            {route.title}
          </h3>
          
          {route.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {route.description}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {route.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center">
            {route.author.image ? (
              <Image
                src={route.author.image}
                alt={route.author.name || 'Автор'}
                width={32}
                height={32}
                className="rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 flex items-center justify-center">
                <span className="text-gray-500 text-xs">
                  {route.author.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">
              {route.author.name || 'Аноним'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
} 