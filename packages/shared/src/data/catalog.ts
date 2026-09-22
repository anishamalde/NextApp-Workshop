import {useState, useEffect} from 'react';
import {createHttpClient} from '../services/httpClient';

export interface Movie {
  id: string;
  title: string;
  category: string;
  genres: string[];
  rating_stars: number;
  release_year: number;
  images: {
    poster_16x9: string;
  };
  description: string;
}

export interface Catalog {
  catalog_version: string;
  updated_at: string;
  items: Movie[];
}

const CATALOG_URL = 'https://giolaq.github.io/scrap-tv-feed/catalog.json';

const catalogClient = createHttpClient({timeout: 10000});

export async function fetchCatalog(): Promise<Catalog> {
  const response = await catalogClient.get<Catalog>(CATALOG_URL);
  if (!response.ok) {
    throw new Error(`Catalog request failed with status ${response.status}`);
  }
  return response.data;
}

export interface UseMoviesResult {
  movies: Movie[];
  loading: boolean;
  error: string | null;
}

export function useMovies(): UseMoviesResult {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCatalog()
      .then(catalog => {
        if (!cancelled) {
          setMovies(catalog.items);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return {movies, loading, error};
}
