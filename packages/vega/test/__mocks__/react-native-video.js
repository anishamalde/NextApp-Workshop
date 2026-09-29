// Stand-in for react-native-video, which only the Expo TV workspace installs.
import React from 'react';
import {View} from 'react-native';

const Video = props => React.createElement(View, {...props, testID: 'mock-video'});

export default Video;
