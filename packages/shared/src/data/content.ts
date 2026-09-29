export interface ContentItem {
  id: string;
  title: string;
  description: string;
  posterUrl: string;
  heroUrl: string;
  videoUrl: string;
}

// Static content for the streaming home screen. Every URL is a clear-content
// HTTPS file (JPEG or MP4) from the workshop catalog, so no fetch is needed.
const BASE_URL = 'https://giolaq.github.io/scrap-tv-feed/content';

export const featuredContent: ContentItem[] = [
  {
    id: 'behind-the-screams',
    title: 'Behind The Screams',
    description:
      'Mort Shambler takes viewers behind the scenes of zombie movie productions, following extras through makeup, rehearsals, and filming. Features the daily challenges of maintaining zombie character while dealing with long shooting days and complex choreography.',
    posterUrl: `${BASE_URL}/behind-the-screams/poster_1920x1080.jpg`,
    heroUrl: `${BASE_URL}/behind-the-screams/poster_1920x1080.jpg`,
    videoUrl: `${BASE_URL}/behind-the-screams/movie_1080p.mp4`,
  },
  {
    id: 'cereal-streamz',
    title: 'Cereal Streamz',
    description:
      'Crunch Time livestreams daily cereal tastings with chat interaction, cereal mixing experiments, and guest appearances from other cereal influencers. Kids tune in to watch their favorite streamers try new cereals, rate combinations, and react to viewer suggestions in real-time.',
    posterUrl: `${BASE_URL}/cereal-streamz/poster_1920x1080.jpg`,
    heroUrl: `${BASE_URL}/cereal-streamz/poster_1920x1080.jpg`,
    videoUrl: `${BASE_URL}/cereal-streamz/movie_1080p.mp4`,
  },
  {
    id: 'feline-assistant',
    title: 'Feline Assistant',
    description:
      'Abyssinian Organized manages the complex schedules and demands of executive cats. Features cats answering phones, scheduling meetings, and maintaining office organization while dealing with the challenge of keeping important papers from being knocked off desks.',
    posterUrl: `${BASE_URL}/feline-assistant/poster_1920x1080.jpg`,
    heroUrl: `${BASE_URL}/feline-assistant/poster_1920x1080.jpg`,
    videoUrl: `${BASE_URL}/feline-assistant/movie_1080p.mp4`,
  },
  {
    id: 'feline-resources',
    title: 'Feline Resources',
    description:
      'Persian Professional leads the HR department in handling workplace conflicts, performance reviews, and employee relations. Features cats in tiny business suits mediating disputes, though meetings often devolve into grooming sessions and territorial disputes over the best office chairs.',
    posterUrl: `${BASE_URL}/feline-resources/poster_1920x1080.jpg`,
    heroUrl: `${BASE_URL}/feline-resources/poster_1920x1080.jpg`,
    videoUrl: `${BASE_URL}/feline-resources/movie_1080p.mp4`,
  },
];
