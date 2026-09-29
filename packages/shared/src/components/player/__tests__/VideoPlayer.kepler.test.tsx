import React from 'react';
import {act, render, screen} from '@testing-library/react-native';
import {VideoPlayer as W3CVideoPlayer} from '@amazon-devices/react-native-w3cmedia';
// Import the Vega file directly: Jest doesn't resolve the .kepler extension.
import {VideoPlayer} from '../VideoPlayer.kepler';

const SOURCE = 'https://example.com/video.mp4';

describe('VideoPlayer (Vega W3C Media)', () => {
  it('initialises the player after the surface exists, then sets surface, autoplay, and src', async () => {
    const calls: string[] = [];
    const proto = W3CVideoPlayer.prototype as any;
    jest.spyOn(proto, 'initialize').mockImplementation(() => {
      calls.push('initialize');
      return Promise.resolve();
    });
    jest.spyOn(proto, 'setSurfaceHandle').mockImplementation(() => {
      calls.push('setSurfaceHandle');
    });
    const clear = jest.spyOn(proto, 'clearSurfaceHandle');
    const deinit = jest.spyOn(proto, 'deinitialize');

    const {unmount} = render(<VideoPlayer source={SOURCE} paused={false} />);
    const surface = screen.getByTestId('mock-video-surface');

    await act(async () => {
      await surface.props.onSurfaceViewCreated('surface-1');
    });

    expect(calls).toEqual(['initialize', 'setSurfaceHandle']);
    const player = (proto.setSurfaceHandle as jest.Mock).mock.contexts[0];
    expect(player.autoplay).toBe(true);
    expect(player.src).toBe(SOURCE);

    await act(async () => {
      unmount();
    });

    expect(clear).toHaveBeenCalledWith('surface-1');
    expect(deinit).toHaveBeenCalled();
  });
});
