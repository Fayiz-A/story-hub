import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, TextInputBase } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';

interface TextFieldData {
   height: number,
   placeholder: string,
   onChangeText: (text: string) => void,
   multiline?: boolean
}

export interface Props {

}

export interface State {
   dimensions: ScaledSize
}

interface Size {
   width: number,
   height: number
}

export default class WriteStoryScreen extends React.Component<Props, State> {

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
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   render() {
      let dimensions: ScaledSize = this.state.dimensions;
      let storyTextFieldSize: Size = { width: dimensions.width / 2, height: dimensions.height / 13 }
      let textFieldDataList: TextFieldData[] = [
         {
            height: storyTextFieldSize.height,
            placeholder: "Title",
            onChangeText: (text: string) => {
               console.log(`Typed value chnaged to: ${text}`)
            },
         },
         {
            height: storyTextFieldSize.height,
            placeholder: "Author",
            onChangeText: (text: string) => {
               console.log(`Typed value chnaged to: ${text}`)
            }
         },
         {
            height: dimensions.height / 1.8,
            placeholder: "Story",
            onChangeText: (text: string) => {
               console.log(`Typed value chnaged to: ${text}`)
            },
            multiline: true
         }
      ];
      return (
         <View>
            <AppBar title="Write Story" />
            {textFieldDataList.map(data => {
               return <View style={textInputStyles(dimensions, storyTextFieldSize).storyTextField}>
                  <TextField
                     textInputWidth={storyTextFieldSize.width}
                     textInputHeight={data.height}
                     placeholder={data.placeholder}
                     onChangeText={data.onChangeText}
                     multiline={data.multiline == null ? false : data.multiline}
                  />
               </View>
            })
            }
         </View>
      )
   }
}

const textInputStyles = (dimensions: ScaledSize, size: Size) => StyleSheet.create({
   storyTextField: {
      paddingLeft: (dimensions.width / 2) - (size.width / 2),
      paddingTop: size.height / 2,
      backgroundColor: "white"
   },
})