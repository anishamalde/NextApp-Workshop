import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import '@testing-library/react-native/extend-expect';
import {HomeScreen} from '../HomeScreen';
import {featuredContent} from '../../data/content';

const [first, second] = featuredContent;

// In the React Native 0.72 JS used by Jest, Pressable's internal handlers
// shadow the onFocus prop on the host view, so call the card's own prop.
// Walk up to the Pressable itself: the first ancestor with onPress but no
// responder handlers.
const focusCard = (id: string) => {
  let node = screen.getByTestId(`content-card-${id}`).parent;
  while (node && !(node.props.onPress && !node.props.onResponderGrant)) {
    node = node.parent;
  }
  act(() => node?.props.onFocus());
};

describe('HomeScreen', () => {
  it('renders the hero and four Featured cards', () => {
    render(<HomeScreen />);

    expect(screen.getByTestId('hero')).toBeTruthy();
    expect(screen.getByText('Featured')).toBeTruthy();
    featuredContent.forEach(item => {
      expect(screen.getByTestId(`content-card-${item.id}`)).toBeTruthy();
    });
    expect(featuredContent).toHaveLength(4);
  });

  it('gives the first card preferred TV focus', () => {
    render(<HomeScreen />);

    expect(
      screen.getByTestId(`content-card-${first.id}`).props.hasTVPreferredFocus,
    ).toBe(true);
    expect(
      screen.getByTestId(`content-card-${second.id}`).props.hasTVPreferredFocus,
    ).toBe(false);
  });

  it('updates the hero when another card is focused', () => {
    render(<HomeScreen />);
    expect(screen.getByTestId('hero-title')).toHaveTextContent(first.title);

    focusCard(second.id);

    expect(screen.getByTestId('hero-title')).toHaveTextContent(second.title);
    expect(screen.getByTestId('hero-description')).toHaveTextContent(
      second.description,
    );
  });

  it('opens the player when a card is selected', () => {
    render(<HomeScreen />);

    fireEvent.press(screen.getByTestId(`content-card-${second.id}`));

    expect(screen.getByTestId('player-view')).toBeTruthy();
    expect(screen.getByTestId('mock-video').props.source).toEqual({
      uri: second.videoUrl,
    });
  });

  it('returns to browse on Exit and keeps the selected card focused', () => {
    render(<HomeScreen />);
    fireEvent.press(screen.getByTestId(`content-card-${second.id}`));
    act(() => screen.getByTestId('mock-video').props.onLoad());

    fireEvent.press(screen.getByTestId('player-exit'));

    expect(screen.queryByTestId('player-view')).toBeNull();
    expect(screen.getByTestId('browse-screen')).toBeTruthy();
    expect(
      screen.getByTestId(`content-card-${second.id}`).props.hasTVPreferredFocus,
    ).toBe(true);
  });
});
