// TV-size Dimensions / PixelRatio so scaled styles stay stable in tests.
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: () => ({width: 1920, height: 1080, scale: 1, fontScale: 1}),
  set: jest.fn(),
  addEventListener: () => ({remove: jest.fn()}),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native/Libraries/Utilities/PixelRatio', () => ({
  get: () => 1,
  getFontScale: () => 1,
  getPixelSizeForLayoutSize: (size) => size,
  roundToNearestPixel: (size) => Math.round(size),
  startDetecting: jest.fn(),
}));

// RN 0.83 requires every NativeAnimatedModule method or Animated crashes under jest.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => {
  const noop = jest.fn();
  return {
    API: {
      createAnimatedNode: noop,
      updateAnimatedNodeConfig: noop,
      getValue: noop,
      startListeningToAnimatedNodeValue: noop,
      stopListeningToAnimatedNodeValue: noop,
      connectAnimatedNodes: noop,
      disconnectAnimatedNodes: noop,
      startAnimatingNode: noop,
      stopAnimation: noop,
      setAnimatedNodeValue: noop,
      setAnimatedNodeOffset: noop,
      flattenAnimatedNodeOffset: noop,
      extractAnimatedNodeOffset: noop,
      connectAnimatedNodeToView: noop,
      disconnectAnimatedNodeFromView: noop,
      restoreDefaultValues: noop,
      dropAnimatedNode: noop,
      addAnimatedEventToView: noop,
      removeAnimatedEventFromView: noop,
      addListener: noop,
      removeListener: noop,
      removeListeners: noop,
      queueAndExecuteBatchedOperations: noop,
    },
    addWhitelistedStyleProp: noop,
    addWhitelistedTransformProp: noop,
    addWhitelistedInterpolationParam: noop,
    isSupportedColorProp: () => true,
    isSupportedStyleProp: () => true,
    isSupportedTransformProp: () => true,
    isSupportedInterpolationParam: () => true,
    validateStyles: noop,
    validateTransform: noop,
    validateInterpolation: noop,
    generateNewNodeTag: () => 0,
    generateNewAnimationId: () => 0,
    assertNativeAnimatedModule: noop,
    shouldUseNativeDriver: () => false,
    transformDataType: (value) => value,
    nativeEventEmitter: {addListener: noop, removeListener: noop},
  };
});

// Suppress React Native Image prop type warnings in tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Warning: Failed prop type') ||
       message.includes('Invalid prop `source` supplied to `Image`') ||
       message.includes('Warning:'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  });

  console.warn = jest.fn((...args) => {
    const message = args[0];
    if (
      typeof message === 'string' &&
      (message.includes('Warning:') || message.includes('prop type'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  });
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});
