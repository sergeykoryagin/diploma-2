'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
}: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Функция для создания URL для перехода на определенную страницу
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Обработчик перехода на страницу
  const goToPage = (pageNumber: number) => {
    router.push(createPageUrl(pageNumber));
  };

  // Если всего одна страница, не показываем пагинацию
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={!hasPrevPage}
        className={`px-4 py-2 rounded ${
          hasPrevPage
            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Назад
      </button>

      <div className="flex items-center space-x-1">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          const isCurrentPage = pageNumber === currentPage;

          // Показываем только текущую страницу, первую, последнюю и соседние страницы
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  isCurrentPage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            );
          }

          // Показываем троеточие для пропущенных страниц (только один раз)
          if (
            (pageNumber === 2 && currentPage > 3) ||
            (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return <span key={pageNumber}>...</span>;
          }

          return null;
        })}
      </div>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-4 py-2 rounded ${
          hasNextPage
            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Вперед
      </button>
    </div>
  );
} 