import {StyleProp, ViewStyle} from 'react-native';

// Shared contract for every platform's video player. PlayerView only talks to
// this interface, so it doesn't know which native player is underneath.
export interface VideoPlayerProps {
  source: string;
  paused: boolean;
  // Called once the first frames are playing (or ready to play).
  onReady?: () => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
  style?: StyleProp<ViewStyle>;
}
