import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ContentCard} from '../components/ContentCard';
import {Hero} from '../components/Hero';
import {PlayerView} from '../components/player/PlayerView';
import {ContentItem, featuredContent} from '../data/content';
import {actionSafe, titleSafe} from '../theme/safeZones';
import {scaleFontSize, scaleHeight} from '../utils/scaling';

// A tiny state machine instead of a navigation framework:
// 'browse' shows the hero and shelf, 'player' shows the video.
type Mode = 'browse' | 'player';

export const HomeScreen = () => {
  const [mode, setMode] = useState<Mode>('browse');
  const [focusedId, setFocusedId] = useState(featuredContent[0].id);

  const focusedItem =
    featuredContent.find(item => item.id === focusedId) ?? featuredContent[0];

  const handleFocus = useCallback((item: ContentItem) => {
    setFocusedId(item.id);
  }, []);

  const handleSelect = useCallback((item: ContentItem) => {
    setFocusedId(item.id);
    setMode('player');
  }, []);

  const handleExit = useCallback(() => setMode('browse'), []);

  if (mode === 'player') {
    return <PlayerView item={focusedItem} onExit={handleExit} />;
  }

  return (
    <View style={styles.container} testID="browse-screen">
      <Hero item={focusedItem} />
      <View style={styles.shelf}>
        <Text style={styles.shelfTitle}>Featured</Text>
        <View style={styles.row}>
          {featuredContent.map(item => (
            <ContentCard
              key={item.id}
              item={item}
              onFocus={handleFocus}
              onSelect={handleSelect}
              // The first card on launch, the last selected card on return.
              hasTVPreferredFocus={item.id === focusedId}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
  },
  shelf: {
    flex: 1,
    paddingHorizontal: titleSafe.horizontal,
    paddingBottom: actionSafe.vertical,
  },
  shelfTitle: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(38),
    fontWeight: 'bold',
    marginTop: scaleHeight(16),
    marginBottom: scaleHeight(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // Room for the 1.08 focus scale so focused cards aren't clipped.
    paddingVertical: scaleHeight(12),
  },
});
