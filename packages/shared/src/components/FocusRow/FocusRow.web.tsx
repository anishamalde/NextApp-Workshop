import React from 'react';
import {View, ViewStyle, StyleProp} from 'react-native';

export interface FocusRowProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const FocusRow = ({children, style, contentContainerStyle}: FocusRowProps) => {
  return <View style={[style, contentContainerStyle]}>{children}</View>;
};
