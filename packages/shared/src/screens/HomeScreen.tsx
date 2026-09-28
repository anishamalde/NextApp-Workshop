import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, ImageBackground, View} from 'react-native';
import {Tile} from '../components/Tile';
import {FocusRow} from '../components/FocusRow/FocusRow';
import {MovieList} from '../components/MovieList/MovieList';
import {tiles} from '../data/tiles';
import {ApiDemo} from '../components/ApiDemo';
import {IconReactNativeAnimated} from '../components/IconReactNativeAnimated/IconReactNativeAnimated';
import {Header} from '../components/Header/Header';

import {scaleFontSize, scaleWidth, scaleHeight} from '../utils/scaling';

export const HomeScreen = () => {
  const [activeTileId, setActiveTileId] = useState<string>('home');
  const [focusedTileId, setFocusedTileId] = useState<string | null>('home');

  const activeTile = tiles.find(t => t.id === activeTileId);

  const handleTileFocus = useCallback((tileId: string) => {
    setActiveTileId(tileId);
    setFocusedTileId(tileId);
  }, []);

  const handleTileBlur = useCallback(() => {
    setFocusedTileId(null);
  }, []);

  const renderFocusedContent = () => {
    if (activeTileId === 'home') {
      return <Header />;
    }

    if (activeTileId === 'movies') {
      return <MovieList />;
    }

    return (
      <>
        <Text style={styles.focusedTitle}>{activeTile?.label}</Text>
        {activeTileId === 'api-demo' && <ApiDemo />}
        {activeTileId === 'animation' && (
          <View style={styles.animationWrapper}>
            <IconReactNativeAnimated />
          </View>
        )}
        {activeTileId !== 'api-demo' && activeTileId !== 'animation' && (
          <Text style={styles.focusedDescription}>
            {activeTile?.description}
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
      <FocusRow
        style={styles.tileRowScroll}
        contentContainerStyle={styles.tileRowContent}>
        {tiles.map(tile => (
          <Tile
            key={tile.id}
            id={tile.id}
            label={tile.label}
            icon={tile.icon}
            isFocused={focusedTileId === tile.id}
            isActive={focusedTileId !== tile.id && activeTileId === tile.id}
            onFocus={handleTileFocus}
            onBlur={handleTileBlur}
            testID={`tile-${tile.id}`}
            accessibilityLabel={tile.accessibilityLabel}
            hasTVPreferredFocus={tile.id === 'home'}
          />
        ))}
      </FocusRow>
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
  tileRowScroll: {
    flex: 1,
  },
  tileRowContent: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  animationWrapper: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
