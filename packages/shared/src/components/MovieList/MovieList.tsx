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
import {FocusRow} from '../FocusRow/FocusRow';
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
    <FocusRow style={styles.container}>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item: Movie) => item.id}
        renderItem={({item, index}) => (
          <MoviePoster movie={item} hasTVPreferredFocus={index === 0} />
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.list}
      />
    </FocusRow>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: scaleHeight(400),
  },
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
