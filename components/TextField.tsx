import React from "react";
import { View, TextInput, StyleSheet, Dimensions, ScaledSize } from "react-native";

export interface Props {
   textInputWidth: number,
   textInputHeight: number
}

export interface State {
   dimensions: ScaledSize
}

export default class TextField extends React.Component<Props, State> {

   constructor(props: Props, state: State) {
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
         console.log(`Event listener for dimensions removed in text field.tsx`)
      });
   }

   render() {
      return (
         <TextInput
            style={styles(this.props, this.state.dimensions).textField}
         />
      );
   }
}

const styles = (props: Props, dimensions: ScaledSize) => StyleSheet.create({
   textField: {
      width: props.textInputWidth,
      height: props.textInputHeight,
      borderColor: "red",
      borderWidth: 3,
      borderRadius: props.textInputWidth / 2,
      backgroundColor: "white"
   }
})