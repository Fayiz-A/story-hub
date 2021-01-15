import React from 'react';
import { StyleSheet, Text, View, Image, ImageSourcePropType, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriteStoryScreen from './screens/writeStoryScreen';
import ReadStoryScreen from './screens/readStoryScreen';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default class App extends React.Component {

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={
            ({route})=>({
              tabBarIcon: ({ focused, color, size}) => {
                let imagePath:ImageSourcePropType;

                if(route.name == "Read Story") {
                  imagePath = require("./read.png");
                } else {
                  imagePath = require("./write.png");
                } 

                let largeScreen:boolean = Dimensions.get("window").width>700;
                let imageSize:number = largeScreen?40:30;

                return <Image source={imagePath} style={{width: imageSize, height: imageSize,}}/>
              }
            })
          }
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',
            // tabStyle: {...{flexDirection: "column"}},
          }}
        >
          <Tab.Screen name="Write Story" component={WriteStoryScreen} />
          <Tab.Screen name="Read Story" component={ReadStoryScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
  },
});