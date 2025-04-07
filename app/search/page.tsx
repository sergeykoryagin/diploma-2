import SearchHeader from '@/components/search/search-header';
import SearchResults from '@/components/search/search-results';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.query as string || '';
  
  return (
    <main className="container mx-auto px-4 py-8">
      <SearchHeader initialQuery={query} />
      <SearchResults query={query} />
    </main>
  );
} 