import React, {useRef, useEffect} from 'react';
import {Animated, StyleSheet, Easing} from 'react-native';
import {scaleWidth, scaleHeight} from '../../utils/scaling';

// Web fallback - Lottie's native renderer isn't available on web,
// so we spin a static React logo with the Animated API instead.
export const IconReactNativeAnimated = () => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.Image
      source={require('../../assets/react-logo.png')}
      style={[styles.logo, {transform: [{rotate: spin}]}]}
    />
  );
};

const styles = StyleSheet.create({
  logo: {
    width: scaleWidth(300),
    height: scaleHeight(300),
    resizeMode: 'contain',
  },
});
