/**
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import 'react-native';
import {render} from '@testing-library/react-native';
import * as React from 'react';

import {App} from '../src/App';

describe('App', () => {
  it('renders the home screen tiles', () => {
    const screen = render(<App />);

    ['home', 'get-started', 'debug', 'learn-more'].forEach(id => {
      expect(screen.getByTestId(`tile-${id}`)).toBeTruthy();
    });
  });
});
