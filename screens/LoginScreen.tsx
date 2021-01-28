import React from "react";
import { View, ScaledSize, Text, Image, Dimensions, StyleSheet } from "react-native";
import AppBar from "../components/AppBar";

export interface Props {

}

export interface State {
   dimensions: ScaledSize
}

export default class LoginScreen extends React.Component<Props, State> {

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
      Dimensions.removeEventListener("change", () => console.log(`Event listener for dimensions removed in LoginScreen.tsx`));
   }

   render() {
      let dimensions = this.state.dimensions;

      return (
         <View>
            <AppBar title='Bedtime Stories'/>
            <View style={responsiveStyles(dimensions).imageContainer}>
               <Image source={{
                  uri: 'https://image.freepik.com/free-vector/crescent-moon-stars-clear-sky-background_1017-26919.jpg', 
                  width: dimensions.width / 3,
                  height: dimensions.height / 4
               }}/>
            </View>
         </View>
      )

   }
}

const responsiveStyles = (dimensions: ScaledSize) => StyleSheet.create({
   imageContainer: {
      marginLeft: (dimensions.width / 2) - ((dimensions.width / 3) / 2),
      marginRight: ((dimensions.width / 2) - ((dimensions.width / 3) / 2))-8,//hardcoded 8 for adjustments. Doesn't affect responsiveness
      marginTop: 20,
      borderWidth: 4,
      borderRadius: 15,
      borderColor: 'black'
   }
})