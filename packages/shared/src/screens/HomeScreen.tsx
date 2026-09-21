import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, ImageBackground, View} from 'react-native';
import {Tile} from '../components/Tile';
import {tiles} from '../data/tiles';

import {scaleFontSize, scaleWidth} from '../utils/scaling';

export const HomeScreen = () => {
  const [focusedTileId, setFocusedTileId] = useState<string>('home');

  const focusedTile = tiles.find(t => t.id === focusedTileId);

  const handleTileFocus = useCallback((tileId: string) => {
    setFocusedTileId(tileId);
  }, []);

  const handleTileBlur = useCallback(() => {
    setFocusedTileId('home');
  }, []);

  const renderFocusedContent = () => {
    if (focusedTileId === 'home') {
      return (
        <Text style={styles.headerText}>
          Hello Vega! Select a tile below.
        </Text>
      );
    }

    return (
      <>
        <Text style={styles.focusedTitle}>{focusedTile?.label}</Text>
        {focusedTile?.description && (
          <Text style={styles.focusedDescription}>
            {focusedTile.description}
          </Text>
        )}
      </>
    );
  };

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}>
      <View style={styles.headerArea}>{renderFocusedContent()}</View>
      <View style={styles.tileRowContent}>
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            id={tile.id}
            label={tile.label}
            icon={tile.icon}
            isFocused={focusedTileId === tile.id}
            onFocus={handleTileFocus}
            onBlur={handleTileBlur}
            testID={`tile-${tile.id}`}
            accessibilityLabel={tile.accessibilityLabel}
            hasTVPreferredFocus={tile.id === 'home'}
          />
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: scaleWidth(160),
  },
  headerArea: {
    flex: 3,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(120),
    fontWeight: 'bold',
  },
  focusedTitle: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(150),
    lineHeight: scaleFontSize(140),
    fontWeight: 'bold',
    width: scaleWidth(700),
  },
  focusedDescription: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(60),
    lineHeight: scaleFontSize(80),
    flex: 1,
  },
  tileRowContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
});
