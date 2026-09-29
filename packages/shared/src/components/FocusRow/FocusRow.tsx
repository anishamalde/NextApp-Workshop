import React from 'react';
import {ViewStyle, StyleProp} from 'react-native';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {TVFocusGuideView} = require('react-native');

export interface FocusRowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const FocusRow = ({children, style, contentContainerStyle}: FocusRowProps) => {
  return (
    <TVFocusGuideView autoFocus style={[style, contentContainerStyle]}>
      {children}
    </TVFocusGuideView>
  );
};
