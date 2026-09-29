import React, {useState, useCallback} from 'react';
import {Image, Pressable, StyleSheet, Text} from 'react-native';
import {ContentItem} from '../data/content';
import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';

export interface ContentCardProps {
  item: ContentItem;
  onFocus: (item: ContentItem) => void;
  onSelect: (item: ContentItem) => void;
  hasTVPreferredFocus?: boolean;
}

export const ContentCard = ({
  item,
  onFocus,
  onSelect,
  hasTVPreferredFocus,
}: ContentCardProps) => {
  const [focused, setFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setFocused(true);
    onFocus(item);
  }, [item, onFocus]);
  const handleBlur = useCallback(() => setFocused(false), []);
  const handlePress = useCallback(() => onSelect(item), [item, onSelect]);

  return (
    <Pressable
      onFocus={handleFocus}
      onBlur={handleBlur}
      onPress={handlePress}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      testID={`content-card-${item.id}`}
      style={[styles.card, focused && styles.cardFocused]}>
      <Image
        source={{uri: item.posterUrl}}
        style={styles.poster}
        resizeMode="cover"
      />
      <Text style={styles.title} numberOfLines={1}>
        {item.title}
      </Text>
    </Pressable>
  );
};

export const CARD_WIDTH = scaleWidth(360);

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    borderRadius: scaleWidth(16),
    borderWidth: scaleWidth(6),
    borderColor: 'transparent',
    padding: scaleWidth(4),
  },
  cardFocused: {
    borderColor: '#FF6200',
    transform: [{scale: 1.08}],
  },
  poster: {
    width: '100%',
    height: scaleHeight(190),
    borderRadius: scaleWidth(10),
    backgroundColor: '#222',
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(28),
    fontWeight: 'bold',
    marginTop: scaleHeight(10),
  },
});
