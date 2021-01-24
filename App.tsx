import React from 'react';
import { Image, ImageSourcePropType, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriteStoryScreen from './screens/WriteStoryScreen';
import ReadStoryScreen from './screens/ReadStoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import GLOBALS from './globals';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import PlatformScreen from './screens/PlatformScreen'
import StoryContentScreen from './screens/StoryContentScreen'
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  
  render() {
    return (
      <AppContainer >
      </AppContainer>
    );
  }
}

const SwitchNavigator = createSwitchNavigator({
  PlatformScreen: {screen: PlatformScreen},
  StoryContentScreen: {screen: StoryContentScreen},
});

const AppContainer = createAppContainer(SwitchNavigator)