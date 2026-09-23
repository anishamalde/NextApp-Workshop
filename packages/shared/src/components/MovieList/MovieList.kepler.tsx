import React, {useCallback} from 'react';
import {Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Carousel, CarouselRenderInfo} from '@amazon-devices/vega-carousel';
import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';
import {useMovies, Movie} from '../../data/catalog';
import {MoviePoster} from './MoviePoster';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';

export const MovieList = () => {
  const {movies, loading, error} = useMovies();

  const getItem = useCallback(
    (index: number) =>
      index >= 0 && index < movies.length ? movies[index] : undefined,
    [movies],
  );
  const getItemCount = useCallback(() => movies.length, [movies]);
  const getItemKey = (info: CarouselRenderInfo<Movie>) => info.item.id;
  const notifyDataError = () => false;
  const renderItem = (info: CarouselRenderInfo<Movie>) => (
    <MoviePoster movie={info.item} />
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#FFFFFF" style={styles.centered} />;
  }
  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }
  if (movies.length === 0) {
    return null;
  }

  return (
    <TVFocusGuideView autoFocus={true} style={styles.container}>
      <Carousel
        dataAdapter={{getItem, getItemCount, getItemKey, notifyDataError}}
        renderItem={renderItem}
        uniqueId="movie-carousel"
      />
    </TVFocusGuideView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scaleHeight(400),
    paddingHorizontal: scaleWidth(20),
  },
  centered: {flex: 1},
  error: {color: '#FFFFFF', fontSize: scaleFontSize(40)},
});
