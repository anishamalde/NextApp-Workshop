import React, {useCallback} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {
  Carousel,
  CarouselRenderInfo,
  ItemInfo,
} from '@amazon-devices/vega-carousel';
import {useMovies, Movie} from '../../data/catalog';
import {MoviePoster} from './MoviePoster';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';

export const MovieList = () => {
  const {movies, loading, error} = useMovies();

  const getItem = useCallback(
    (index: number): ItemInfo<Movie> => ({item: movies[index], index}),
    [movies],
  );
  const getItemCount = useCallback(() => movies.length, [movies]);
  const getItemKey = useCallback(
    (index: number) => movies[index].id,
    [movies],
  );
  const notifyDataError = useCallback((err: Error) => {
    console.warn('MovieList carousel data error:', err);
  }, []);

  const renderItem = useCallback(
    ({item}: CarouselRenderInfo<Movie>) => <MoviePoster movie={item} />,
    [],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        dataAdapter={{getItem, getItemCount, getItemKey, notifyDataError}}
        renderItem={renderItem}
        testID="movie-carousel"
        uniqueId="movie-carousel"
        orientation="horizontal"
        renderedItemsCount={8}
        numOffsetItems={2}
        initialStartIndex={0}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scaleHeight(400),
    paddingHorizontal: scaleWidth(20),
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(40),
  },
});
