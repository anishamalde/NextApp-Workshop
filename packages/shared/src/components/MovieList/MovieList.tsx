import React from 'react';
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';
import {useMovies, Movie} from '../../data/catalog';
import {MoviePoster} from './MoviePoster';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';

export const MovieList = () => {
  const {movies, loading, error} = useMovies();

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
    <FlatList
      horizontal
      data={movies}
      keyExtractor={(item: Movie) => item.id}
      renderItem={({item}) => <MoviePoster movie={item} />}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: '100%',
  },
  content: {
    paddingHorizontal: scaleWidth(20),
    paddingVertical: scaleHeight(20),
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
