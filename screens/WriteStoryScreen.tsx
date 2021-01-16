import React, {Component} from 'react';
import { View, StyleSheet, Dimensions, ScaledSize } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';

export interface Props {

}

export interface State {
   dimensions: ScaledSize
}

export default class WriteStoryScreen extends React.Component<Props, State> {
   
   constructor(props:Props, state:State) {
      super(props, state);

      this.state = {
         dimensions: Dimensions.get("window")
      }
   }

   componentDidMount() {
      Dimensions.addEventListener("change", ({window, screen}) => {
         this.setState({
            dimensions: window
         })
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({window, screen}) => {
         console.log(`Event listener for dimensions removed in text field.tsx`)
      });
   }

   render() {
      return (
         <View>
            <AppBar title="Write Story"/>
            <View style={styles(this.state.dimensions).storyTitleTextField}>
               <TextField textInputWidth={200} textInputHeight={50}/>
            </View>
         </View>
      )
   }
}

const styles = (dimensions:ScaledSize) => StyleSheet.create({
   storyTitleTextField: {
      paddingLeft: dimensions.width/2,
      paddingTop: dimensions.height/2,
      backgroundColor: "white"
   }
})