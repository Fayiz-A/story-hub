import React from 'react';
import { Image, ImageSourcePropType, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import WriteStoryScreen from './WriteStoryScreen';
import ReadStoryScreen from './ReadStoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import GLOBALS from '../globals';
import { createAppContainer, NavigationScreenProp } from 'react-navigation';

const Tab = createBottomTabNavigator();

export interface Props {
   navigation: NavigationScreenProp<any, any>
}

export default class PlatformScreen extends React.Component<Props> {

   constructor(props:Props) {
      super(props);
   }

   render() {
      return (
         <NavigationContainer>
            <Tab.Navigator
               screenOptions={
                  ({ route }) => ({
                     tabBarIcon: ({ focused, color, size }) => {
                        let imagePath: ImageSourcePropType;

                        if (route.name == GLOBALS.readScreenName) {
                           imagePath = require("../assets/read.png");
                        } else {
                           imagePath = require("../assets/write.png");
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
               <Tab.Screen name={GLOBALS.readScreenName} children={()=><ReadStoryScreen navigation = {this.props.navigation}/>} />
               <Tab.Screen name={GLOBALS.writeScreenName} component={WriteStoryScreen} />
            </Tab.Navigator>
         </NavigationContainer>
      )
   }
}