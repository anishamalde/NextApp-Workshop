import React from 'react';
import {ViewStyle, StyleProp} from 'react-native';
import {TVFocusGuideView} from '@amazon-devices/react-native-kepler';

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
