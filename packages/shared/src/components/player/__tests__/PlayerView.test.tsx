import React from 'react';
import {act, fireEvent, render, screen} from '@testing-library/react-native';
import {PlayerView} from '../PlayerView';
import {featuredContent} from '../../../data/content';

const item = featuredContent[0];
const video = () => screen.getByTestId('mock-video');
const controlsHidden = () => {
  const style = [screen.getByTestId('player-controls').props.style].flat();
  return style.some(s => s && s.opacity === 0);
};

describe('PlayerView', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('shows a loading state until the video is ready', () => {
    render(<PlayerView item={item} onExit={jest.fn()} />);
    expect(screen.getByTestId('player-loading')).toBeTruthy();

    act(() => video().props.onLoad());

    expect(screen.queryByTestId('player-loading')).toBeNull();
  });

  it('shows an error state when playback fails', () => {
    render(<PlayerView item={item} onExit={jest.fn()} />);

    act(() => video().props.onError({error: {errorString: 'HTTP 403'}}));

    expect(screen.getByTestId('player-error')).toBeTruthy();
    expect(screen.getByText('HTTP 403')).toBeTruthy();
    expect(screen.queryByTestId('player-play-pause')).toBeNull();
    expect(screen.getByTestId('player-exit')).toBeTruthy();
  });

  it('toggles between Pause and Play', () => {
    render(<PlayerView item={item} onExit={jest.fn()} />);
    act(() => video().props.onLoad());
    expect(video().props.paused).toBe(false);
    expect(screen.getByText('Pause')).toBeTruthy();

    fireEvent.press(screen.getByTestId('player-play-pause'));

    expect(video().props.paused).toBe(true);
    expect(screen.getByText('Play')).toBeTruthy();
  });

  it('hides the controls after five seconds and keeps them mounted', () => {
    render(<PlayerView item={item} onExit={jest.fn()} />);
    act(() => video().props.onLoad());
    expect(controlsHidden()).toBe(false);

    act(() => jest.advanceTimersByTime(5000));

    expect(controlsHidden()).toBe(true);
    expect(screen.getByTestId('player-play-pause')).toBeTruthy();

    // The first press while hidden only reveals the controls.
    fireEvent.press(screen.getByTestId('player-play-pause'));
    expect(controlsHidden()).toBe(false);
    expect(video().props.paused).toBe(false);
  });

  it('calls onExit from the Exit button', () => {
    const onExit = jest.fn();
    render(<PlayerView item={item} onExit={onExit} />);
    act(() => video().props.onLoad());

    fireEvent.press(screen.getByTestId('player-exit'));

    expect(onExit).toHaveBeenCalledTimes(1);
  });
});
