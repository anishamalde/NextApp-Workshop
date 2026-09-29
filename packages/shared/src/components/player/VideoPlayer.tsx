import React from 'react';
import Video from 'react-native-video';
import {VideoPlayerProps} from './types';

// Android TV and Apple TV: react-native-video.
export const VideoPlayer = ({
  source,
  paused,
  onReady,
  onError,
  onEnd,
  style,
}: VideoPlayerProps) => {
  return (
    <Video
      source={{uri: source}}
      paused={paused}
      resizeMode="contain"
      controls={false}
      onLoad={() => onReady?.()}
      onError={e =>
        onError?.(e.error.errorString ?? e.error.localizedDescription ?? 'Playback error')
      }
      onEnd={onEnd}
      style={style}
    />
  );
};
