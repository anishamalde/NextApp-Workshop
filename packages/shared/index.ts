export {Header} from './src/components/Header/Header';
export {HomeScreen} from './src/screens/HomeScreen';
export {ApiDemo} from './src/components/ApiDemo';
export {MovieList} from './src/components/MovieList/MovieList';
export {MoviePoster} from './src/components/MovieList/MoviePoster';
export {fetchCatalog, useMovies} from './src/data/catalog';
export type {Movie, Catalog} from './src/data/catalog';

export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';

// HTTP Client (fetch-based)
export {createHttpClient} from './src/services/httpClient';
export type {HttpClientConfig, HttpResponse} from './src/services/httpClient';
