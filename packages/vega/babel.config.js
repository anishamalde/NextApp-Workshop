/*
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */
module.exports = {
  presets: [
    [
      'module:metro-react-native-babel-preset',
      // W3C Media needs the automatic JSX runtime
      {useTransformReactJSXExperimental: true},
    ],
    'module:@amazon-devices/kepler-module-resolver-preset', // Enables usage of VegaModuleResolverPreset
  ],
  plugins: [['@babel/plugin-transform-react-jsx', {runtime: 'automatic'}]],
};
