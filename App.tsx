import React from 'react';
import { Image, ImageSourcePropType, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriteStoryScreen from './screens/WriteStoryScreen';
import ReadStoryScreen from './screens/ReadStoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import GLOBALS from './globals';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppReducer from './redux/reducers/Reducers';
import WriteStoryReducer from './redux/reducers/Reducers';

const Tab = createBottomTabNavigator();
const store = createStore(WriteStoryReducer);

export default class App extends React.Component {

  render() {
    console.log(`Store state: ${JSON.stringify(store.getState())}`);

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={
              ({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let imagePath: ImageSourcePropType;

                  if (route.name == GLOBALS.readScreenName) {
                    imagePath = require("./assets/read.png");
                  } else {
                    imagePath = require("./assets/write.png");
                  }

                  let largeScreen: boolean = Dimensions.get("window").width > 700;
                  let imageSize: number = largeScreen ? 40 : 30;

                  return <Image source={imagePath} style={{ width: imageSize, height: imageSize, }} />
                }
              })
            }
            tabBarOptions={{
              activeTintColor: 'tomato',
              inactiveTintColor: 'gray',
            }}
          >
            <Tab.Screen name={GLOBALS.writeScreenName} component={WriteStoryScreen} />
            <Tab.Screen name={GLOBALS.readScreenName} component={ReadStoryScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}