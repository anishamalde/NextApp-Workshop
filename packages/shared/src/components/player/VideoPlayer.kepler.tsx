import React, {useCallback, useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  KeplerVideoSurfaceView,
  VideoPlayer as W3CVideoPlayer,
} from '@amazon-devices/react-native-w3cmedia';
import {VideoPlayerProps} from './types';

// Vega: W3C Media in URL mode. The player is created once the video surface
// exists, then the surface handle, autoplay flag, and MP4 URL are set in order.
export const VideoPlayer = ({
  source,
  paused,
  onReady,
  onError,
  onEnd,
  style,
}: VideoPlayerProps) => {
  const playerRef = useRef<W3CVideoPlayer | null>(null);
  const surfaceHandleRef = useRef<string | null>(null);

  // Keep the latest props in refs so the native callbacks never go stale.
  const pausedRef = useRef(paused);
  pausedRef.current = paused;
  const callbacksRef = useRef({onReady, onError, onEnd});
  callbacksRef.current = {onReady, onError, onEnd};

  const handlePlaying = useCallback(() => callbacksRef.current.onReady?.(), []);
  const handleEnded = useCallback(() => callbacksRef.current.onEnd?.(), []);
  const handleError = useCallback(() => {
    const code = playerRef.current?.error?.code;
    callbacksRef.current.onError?.(
      code ? `Playback failed (error ${code})` : 'Playback failed',
    );
  }, []);

  const teardown = useCallback(async () => {
    const player = playerRef.current;
    playerRef.current = null;
    if (!player) {
      return;
    }
    player.removeEventListener('playing', handlePlaying);
    player.removeEventListener('ended', handleEnded);
    player.removeEventListener('error', handleError);
    player.pause();
    if (surfaceHandleRef.current) {
      player.clearSurfaceHandle(surfaceHandleRef.current);
      surfaceHandleRef.current = null;
    }
    await player.deinitialize();
  }, [handlePlaying, handleEnded, handleError]);

  const onSurfaceViewCreated = useCallback(
    async (surfaceHandle: string) => {
      const player = new W3CVideoPlayer();
      playerRef.current = player;
      try {
        await player.initialize();
        if (playerRef.current !== player) {
          // Unmounted while initialising.
          await player.deinitialize();
          return;
        }
        player.addEventListener('playing', handlePlaying);
        player.addEventListener('ended', handleEnded);
        player.addEventListener('error', handleError);
        surfaceHandleRef.current = surfaceHandle;
        player.setSurfaceHandle(surfaceHandle);
        player.autoplay = !pausedRef.current;
        player.src = source;
      } catch (err) {
        callbacksRef.current.onError?.(
          err instanceof Error ? err.message : 'Could not start the player',
        );
      }
    },
    [source, handlePlaying, handleEnded, handleError],
  );

  const onSurfaceViewDestroyed = useCallback(() => {
    teardown();
  }, [teardown]);

  // Play/Pause from the controls.
  useEffect(() => {
    const player = playerRef.current;
    if (!player) {
      return;
    }
    if (paused) {
      player.pause();
    } else {
      player.play();
    }
  }, [paused]);

  // Safety net: release the player if the surface callback never fires.
  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  return (
    <View style={style}>
      <KeplerVideoSurfaceView
        style={StyleSheet.absoluteFill}
        onSurfaceViewCreated={onSurfaceViewCreated}
        onSurfaceViewDestroyed={onSurfaceViewDestroyed}
      />
    </View>
  );
};
