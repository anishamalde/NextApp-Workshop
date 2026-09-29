// Stand-in for @amazon-devices/react-native-w3cmedia (Vega W3C Media).
const React = require('react');
const {View} = require('react-native');

class VideoPlayer {
  constructor() {
    this.autoplay = false;
    this.src = '';
    this.error = null;
  }
  initialize() {
    return Promise.resolve();
  }
  deinitialize() {
    return Promise.resolve();
  }
  setSurfaceHandle() {}
  clearSurfaceHandle() {}
  addEventListener() {}
  removeEventListener() {}
  play() {}
  pause() {}
}

const KeplerVideoSurfaceView = props =>
  React.createElement(View, {...props, testID: 'mock-video-surface'});

module.exports = {VideoPlayer, KeplerVideoSurfaceView};
