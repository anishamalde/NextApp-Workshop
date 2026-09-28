import React, {memo, useCallback} from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {scaleFontSize, scaleWidth} from '../utils/scaling';

export interface TileProps {
  id: string;
  label: string;
  icon: ImageSourcePropType;
  isFocused: boolean;
  isActive?: boolean;
  onFocus: (id: string) => void;
  onBlur: () => void;
  testID?: string;
  accessibilityLabel?: string;
  hasTVPreferredFocus?: boolean;
}

export const Tile = memo(
  ({
    id,
    label,
    icon,
    isFocused,
    isActive,
    onFocus,
    onBlur,
    testID,
    accessibilityLabel,
    hasTVPreferredFocus,
  }: TileProps) => {
    const handleFocus = useCallback(() => onFocus(id), [id, onFocus]);

    const stateStyle = isFocused
      ? styles.focused
      : isActive
      ? styles.active
      : styles.default;

    return (
      <TouchableOpacity
        style={[styles.tile, stateStyle]}
        onFocus={handleFocus}
        onBlur={onBlur}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        hasTVPreferredFocus={hasTVPreferredFocus}
        activeOpacity={0.8}>
        <View style={styles.topHalf}>
          <Image source={icon} style={styles.icon} accessible={false} />
        </View>
        <View style={styles.bottomHalf}>
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  tile: {
    width: scaleWidth(320),
    height: scaleWidth(320),
    borderRadius: scaleWidth(44),
    overflow: 'hidden',
    padding: scaleWidth(20),
    borderWidth: scaleWidth(6),
  },
  topHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomHalf: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  default: {
    backgroundColor: '#0074B8',
    borderColor: 'transparent',
  },
  active: {
    backgroundColor: '#0074B8',
    borderColor: '#FF6200',
  },
  focused: {
    backgroundColor: '#FF6200',
    borderColor: '#FF6200',
    transform: [{scale: 1.1}],
    opacity: 1,
  },
  icon: {
    width: scaleWidth(80),
    height: scaleWidth(80),
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  label: {
    color: '#FFFFFF',
    fontSize: scaleFontSize(45),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: scaleFontSize(52),
    width: '100%',
  },
});
