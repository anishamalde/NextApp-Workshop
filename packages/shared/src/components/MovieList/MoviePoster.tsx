import React, {useState, useCallback} from 'react';
import {View, Text, Image, Pressable, StyleSheet} from 'react-native';
import {scaleFontSize, scaleWidth, scaleHeight} from '../../utils/scaling';
import {Movie} from '../../data/catalog';

export interface MoviePosterProps {
  movie: Movie;
}

export const MoviePoster = ({movie}: MoviePosterProps) => {
  const [focused, setFocused] = useState(false);

  const onFocus = useCallback(() => setFocused(true), []);
  const onBlur = useCallback(() => setFocused(false), []);

  return (
    <Pressable
      onFocus={onFocus}
      onBlur={onBlur}
      style={[styles.container, focused && styles.containerFocused]}>
      <Image
        source={{uri: movie.images.poster_16x9}}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={1}>
        {movie.title}
      </Text>
      <Text style={styles.meta}>
        {movie.release_year} · {movie.rating_stars.toFixed(1)}★
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scaleWidth(480),
    marginRight: scaleWidth(30),
  },
  containerFocused: {
    transform: [{scale: 1.05}],
  },
  poster: {
    width: scaleWidth(480),
    height: scaleHeight(270),
    borderRadius: scaleWidth(12),
    backgroundColor: '#222',
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(32),
    fontWeight: 'bold',
    marginTop: scaleHeight(12),
  },
  meta: {
    color: '#CCCCCC',
    fontSize: scaleFontSize(24),
    marginTop: scaleHeight(4),
  },
});
