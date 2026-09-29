import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {VideoPlayerProps} from './types';

// Only the parts of HTMLVideoElement this fallback uses.
interface HtmlVideo {
  muted: boolean;
  play(): Promise<void>;
  pause(): void;
}

// Web: a plain HTML <video> element. No native player needed.
export const VideoPlayer = ({
  source,
  paused,
  onReady,
  onError,
  onEnd,
  style,
}: VideoPlayerProps) => {
  const videoRef = useRef<HtmlVideo | null>(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (paused) {
      video.pause();
      return;
    }
    video.play().catch((err: {name?: string}) => {
      // Browsers can block unmuted autoplay. Retry muted so playback starts.
      // Other rejections (e.g. a pause() before play() resolved) are expected.
      if (err?.name !== 'NotAllowedError' || pausedRef.current) {
        return;
      }
      video.muted = true;
      video.play().catch(() => onError?.('The browser blocked playback'));
    });
  }, [paused, source, onError]);

  return (
    <View style={style}>
      {React.createElement('video', {
        ref: videoRef,
        src: source,
        autoPlay: !paused,
        playsInline: true,
        onPlaying: () => onReady?.(),
        onError: () => onError?.('This video could not be loaded'),
        onEnded: onEnd,
        style: webStyles.video,
      })}
    </View>
  );
};

const webStyles = {
  video: {width: '100%', height: '100%', objectFit: 'contain'},
};
