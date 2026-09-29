// Stand-in for react-native-video. Tests find it by testID and call its
// onLoad / onError / onEnd props to simulate playback events.
const React = require('react');
const {View} = require('react-native');

const Video = props => React.createElement(View, {...props, testID: 'mock-video'});

module.exports = Video;
module.exports.default = Video;
