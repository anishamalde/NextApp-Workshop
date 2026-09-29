export {Header} from './src/components/Header/Header';
export {HomeScreen} from './src/screens/HomeScreen';

export {
  scaleFontSize,
  scaleWidth,
  scaleHeight,
} from './src/utils/scaling';



export {ApiDemo} from './src/components/ApiDemo';

// HTTP Client (fetch-based)
export {createHttpClient} from './src/services/httpClient';
export type {HttpClientConfig, HttpResponse} from './src/services/httpClient';

export {MovieList} from './src/components/MovieList/MovieList';
export {MoviePoster} from './src/components/MovieList/MoviePoster';
export {fetchCatalog, useMovies} from './src/data/catalog';
export type {Movie, Catalog} from './src/data/catalog';

// Streaming home screen
export {Hero} from './src/components/Hero';
export {ContentCard} from './src/components/ContentCard';
export {PlayerView} from './src/components/player/PlayerView';
export {VideoPlayer} from './src/components/player/VideoPlayer';
export type {VideoPlayerProps} from './src/components/player/types';
export {featuredContent} from './src/data/content';
export type {ContentItem} from './src/data/content';
export {actionSafe, titleSafe} from './src/theme/safeZones';
