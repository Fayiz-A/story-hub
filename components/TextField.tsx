import React from "react";
import { View, TextInput, StyleSheet, Dimensions, ScaledSize } from "react-native";

export interface Props {
   textInputWidth: number,
   textInputHeight: number,
   placeholder: string,
   onChangeText: (text: string) => void,
   multiline: boolean,
   reference?: (input: TextInput) => void;
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
            placeholder={this.props.placeholder}
            onChangeText={this.props.onChangeText}
            multiline={this.props.multiline}
            ref = {this.props.reference}
         />
      );
   }
}

const styles = (props: Props, dimensions: ScaledSize) => StyleSheet.create({
   textField: {
      width: props.textInputWidth,
      height: props.textInputHeight,
      borderColor: "black",
      borderWidth: 4,
      borderRadius: props.multiline ? 20:props.textInputWidth / 2,
      backgroundColor: "white",
      paddingLeft: 5,
      fontSize: dimensions.height / 30
   }
})

