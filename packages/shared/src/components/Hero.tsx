import React from 'react';
import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import {ContentItem} from '../data/content';
import {titleSafe} from '../theme/safeZones';
import {scaleFontSize, scaleHeight, scaleWidth} from '../utils/scaling';

export interface HeroProps {
  item: ContentItem;
}

export const Hero = ({item}: HeroProps) => {
  return (
    <ImageBackground
      source={{uri: item.heroUrl}}
      style={styles.hero}
      resizeMode="cover"
      testID="hero">
      {/* Two stacked scrims keep the text readable on bright images */}
      <View style={styles.scrim} />
      <View style={styles.bottomScrim} />
      <View style={styles.textArea}>
        <Text style={styles.title} testID="hero-title">
          {item.title}
        </Text>
        <Text
          style={styles.description}
          numberOfLines={3}
          testID="hero-description">
          {item.description}
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  hero: {
    width: '100%',
    height: scaleHeight(640),
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  bottomScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: scaleHeight(360),
    backgroundColor: 'rgba(11, 15, 26, 0.7)',
  },
  textArea: {
    paddingHorizontal: titleSafe.horizontal,
    paddingBottom: scaleHeight(40),
    width: scaleWidth(1400),
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(60),
    fontWeight: 'bold',
  },
  description: {
    color: '#E0E0E0',
    fontSize: scaleFontSize(28),
    lineHeight: scaleFontSize(40),
    marginTop: scaleHeight(12),
  },
});
