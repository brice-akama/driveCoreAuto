

import SearchPage from './SearchPage';

// SERVER-SIDE metadata generation
import { Metadata } from 'next';

interface SearchPageProps {
  searchParams: { query?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.query || '';

  return {
    title: query ? `Search results for: ${query} | DriveCore Auto` : 'Search | DriveCore Auto',
    description: query 
      ? `Showing search results for "${query}" on DriveCore Auto.` 
      : 'Search products and blogs on DriveCore Auto.',
  };
}

// CLIENT COMPONENT
export default function Page() {
  return <SearchPage />;
}
