import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, Text } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import CustomButton from '../components/CustomButton';
import firebase from '../configs/firebase.config';
import GLOBALS from '../globals';

interface TextFieldData {
   height: number,
   placeholder: string,
   onChangeText: (text: string) => void,
   multiline?: boolean
}

export interface Props {

}

export interface State {
   dimensions: ScaledSize,
   stories: StoryDocument[],
   storyWritten: StoryDocument
}

interface Size {
   width: number,
   height: number
}

interface StoryDocument {
   author: string,
   title: string,
   story: string,
}

export default class WriteStoryScreen extends React.Component<Props, State> {

   constructor(props: Props, state: State) {
      super(props, state);

      this.state = {
         dimensions: Dimensions.get("window"),
         stories: [],
         storyWritten: {
            title: '',
            author: '',
            story: ''
         }
      }
   }

   componentDidMount() {
      Dimensions.addEventListener("change", ({ window, screen }) => {
         this.setState({
            dimensions: window
         })
      })

      this.getAllStoriesFromFirestore();
   }

   getAllStoriesFromFirestore = async () => {
      let storiesResponse:any = await firebase.firestore().collection(GLOBALS.firestore.collections.stories).get();
      
      let stories:StoryDocument[] = storiesResponse.data();

      this.setState({
         stories: stories
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   submitStory = async() => {
      let storyWritten = this.state.storyWritten;

      firebase.firestore().collection(GLOBALS.firestore.collections.stories).add({
         title: storyWritten.title,
         author: storyWritten.author,
         story: storyWritten.story
      })
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
            height: dimensions.height / 2.15,
            placeholder: "Story",
            onChangeText: (text: string) => {
               console.log(`Typed value chnaged to: ${text}`)
            },
            multiline: true
         }
      ];
      let customButtonWidth: number = 120;
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
            <CustomButton
               onPress={() => { console.log(`Submit tapped`) }}
               title="Submit"
               color="red"
               paddingTop={20}
               paddingLeft={(dimensions.width / 2) - (customButtonWidth / 2)}
               width={customButtonWidth}
            />
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