import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ContentItem} from '../../data/content';
import {actionSafe, titleSafe} from '../../theme/safeZones';
import {scaleFontSize, scaleHeight, scaleWidth} from '../../utils/scaling';
import {VideoPlayer} from './VideoPlayer';

const CONTROLS_TIMEOUT_MS = 5000;

type Status = 'loading' | 'playing' | 'error';

export interface PlayerViewProps {
  item: ContentItem;
  onExit: () => void;
}

export const PlayerView = ({item, onExit}: PlayerViewProps) => {
  const [status, setStatus] = useState<Status>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [paused, setPaused] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
    }
    hideTimer.current = setTimeout(
      () => setControlsVisible(false),
      CONTROLS_TIMEOUT_MS,
    );
  }, []);

  // Clear the auto-hide timer on unmount.
  useEffect(() => {
    return () => {
      if (hideTimer.current) {
        clearTimeout(hideTimer.current);
      }
    };
  }, []);

  // Back stops playback (by unmounting the player) and returns to browse.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        onExit();
        return true;
      },
    );
    return () => subscription.remove();
  }, [onExit]);

  const handleReady = useCallback(() => {
    setStatus('playing');
    showControls();
  }, [showControls]);

  const handleError = useCallback((message: string) => {
    setErrorMessage(message);
    setStatus('error');
    setControlsVisible(true);
  }, []);

  // The controls stay mounted while hidden, so they keep D-pad focus.
  // When hidden, the first press only reveals them.
  const handlePlayPause = useCallback(() => {
    if (!controlsVisible) {
      showControls();
      return;
    }
    setPaused(p => !p);
    showControls();
  }, [controlsVisible, showControls]);

  const handleExit = useCallback(() => {
    if (!controlsVisible) {
      showControls();
      return;
    }
    onExit();
  }, [controlsVisible, showControls, onExit]);

  const isError = status === 'error';

  return (
    <View style={styles.container} testID="player-view">
      {!isError && (
        <VideoPlayer
          source={item.videoUrl}
          paused={paused}
          onReady={handleReady}
          onError={handleError}
          onEnd={onExit}
          style={StyleSheet.absoluteFill}
        />
      )}

      {status === 'loading' && (
        <View style={styles.centered} testID="player-loading">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.message}>Loading {item.title}…</Text>
        </View>
      )}

      {isError && (
        <View style={styles.centered} testID="player-error">
          <Text style={styles.errorTitle}>Can't play this video</Text>
          <Text style={styles.message}>{errorMessage}</Text>
        </View>
      )}

      <View
        style={[styles.controls, !controlsVisible && styles.controlsHidden]}
        testID="player-controls">
        <Text style={styles.title} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={styles.buttonRow}>
          {!isError && (
            <ControlButton
              label={paused ? 'Play' : 'Pause'}
              testID="player-play-pause"
              onPress={handlePlayPause}
              onFocus={showControls}
              hasTVPreferredFocus
            />
          )}
          <ControlButton
            label="Exit"
            testID="player-exit"
            onPress={handleExit}
            onFocus={showControls}
            hasTVPreferredFocus={isError}
          />
        </View>
      </View>
    </View>
  );
};

interface ControlButtonProps {
  label: string;
  testID: string;
  onPress: () => void;
  onFocus: () => void;
  hasTVPreferredFocus?: boolean;
}

const ControlButton = ({
  label,
  testID,
  onPress,
  onFocus,
  hasTVPreferredFocus,
}: ControlButtonProps) => {
  const [focused, setFocused] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onFocus={() => {
        setFocused(true);
        onFocus();
      }}
      onBlur={() => setFocused(false)}
      hasTVPreferredFocus={hasTVPreferredFocus}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={testID}
      style={[styles.button, focused && styles.buttonFocused]}>
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
  },
  centered: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    color: '#E0E0E0',
    fontSize: scaleFontSize(30),
    marginTop: scaleHeight(20),
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(48),
    fontWeight: 'bold',
  },
  controls: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: titleSafe.horizontal,
    paddingTop: scaleHeight(40),
    paddingBottom: actionSafe.vertical + scaleHeight(20),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  controlsHidden: {
    opacity: 0,
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(40),
    fontWeight: 'bold',
    marginBottom: scaleHeight(24),
  },
  buttonRow: {
    flexDirection: 'row',
  },
  button: {
    minWidth: scaleWidth(220),
    paddingVertical: scaleHeight(18),
    paddingHorizontal: scaleWidth(40),
    marginRight: scaleWidth(32),
    borderRadius: scaleWidth(12),
    borderWidth: scaleWidth(4),
    borderColor: 'transparent',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  buttonFocused: {
    backgroundColor: '#FF6200',
    borderColor: '#FFFFFF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(32),
    fontWeight: 'bold',
  },
});
