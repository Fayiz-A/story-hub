import React from "react";
import { View, StyleSheet, Text, Button, Dimensions, ScaledSize, ScrollView } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import AppBar from "../components/AppBar";
import CustomButton from "../components/CustomButton";

export interface Props {
   navigation: NavigationScreenProp<any, any>
}

export interface State {
   dimensions: ScaledSize
}

export default class StoryContentScreen extends React.Component<Props, State> {

   constructor(props:Props, state:State) {
      super(props, state);
      
      this.state = {
         dimensions: Dimensions.get("window")
      }
   }

   componentDidMount() {
      Dimensions.addEventListener("change", ({ window, screen }) => {
         this.setState({
            dimensions: window
         })
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   render() {
      let dimensions = this.state.dimensions;

      let story = this.props.navigation.getParam('story');

      return (
         <ScrollView>
            <View style={styles(dimensions).background}>
               <AppBar title = {story.title}/>
               <CustomButton 
                  title="Back" 
                  onPress={() => {this.props.navigation.navigate({routeName: "PlatformScreen"})}}
                  color="red"
                  paddingLeft= {20}
                  paddingTop={10}
                  width={70}
               />
               <View style={styles(dimensions).storyContentContainer}>
                  <Text
                     style={styles(dimensions).storyContent}
                  >
                     {story.story}
                  </Text>
               </View>
            </View>
         </ScrollView>
      )
   }
}

const styles = (dimensions:ScaledSize) => StyleSheet.create({
   background: {
      height: dimensions.height,
      backgroundColor: "#ffe57f",
   },
   storyContentContainer: {
      paddingLeft: 20,
      paddingTop: 10
   },
   storyContent: {
      fontSize: dimensions.height / 30,
   }
})