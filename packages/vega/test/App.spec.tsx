/**
 * Copyright (c) 2022 Amazon.com, Inc. or its affiliates.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL.  USE IS SUBJECT TO LICENSE TERMS.
 */

import 'react-native';
import {fireEvent, render} from '@testing-library/react-native';
import * as React from 'react';
import {featuredContent} from '@multitv/shared';

import {App} from '../src/App';

describe('App', () => {
  it('renders the streaming home screen', () => {
    const screen = render(<App />);

    expect(screen.getByTestId('hero')).toBeTruthy();
    featuredContent.forEach(item => {
      expect(screen.getByTestId(`content-card-${item.id}`)).toBeTruthy();
    });
  });

  it('opens the player when a card is selected', () => {
    const screen = render(<App />);

    fireEvent.press(screen.getByTestId(`content-card-${featuredContent[0].id}`));

    expect(screen.getByTestId('player-view')).toBeTruthy();
    expect(screen.getByTestId('mock-video')).toBeTruthy();
  });
});
