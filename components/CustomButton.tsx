//importing the libraries
import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ColorValue } from 'react-native';

export interface Props {
   onPress: () => any,
   title: String,
   color: ColorValue,
   width: number,
   marginTop: number,
   marginLeft: number
}

export default class CustomButton extends Component<Props> {

   constructor(props: Props) {
      super(props);

   }

  render() {
    return (
      <View style={styles(this.props).buttonSurrounding}>
        <TouchableOpacity
          style={styles(this.props).button}
          onPress={this.props.onPress()}>
          <Text style={styles(this.props).textStyle}>{this.props.title}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = (props: Props) =>
  StyleSheet.create({
    button: {
      backgroundColor: props.color,
      justifyContent: 'center',
      alignItems: 'center',
      width: props.width,
      height: 55,
      borderRadius: 28
    },
    buttonSurrounding: {
      marginTop: props.marginTop,
      marginLeft: props.marginLeft,
    },
    textStyle: {
      fontSize: 20,
      color: 'white',
      // fontFamily: 'cursive',
      fontWeight: 'bold',
    },
  });
