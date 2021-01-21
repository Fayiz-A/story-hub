import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, ToastAndroid, Platform } from 'react-native';
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

export default class ReadStoryScreen extends React.Component<Props, State> {

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
      try {
         let storiesResponse = await firebase.firestore().collection(GLOBALS.firestore.collections.stories).get();
         let _stories:StoryDocument[] = [];
      
         storiesResponse.docs.map(doc => {
            _stories.push( {
               author: doc.data().author,
               title: doc.data().title,
               story: doc.data().story
            })
         });
   
         this.setState({
            stories: _stories
         })
      } catch(e) {
         console.error(`Error occurred in fetching stories ${e}`)
      }
      
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   validateAndSubmitStory = async (storyWritten: StoryDocument) => {
      let storyValidations = GLOBALS.storyValidations;
      let storyValidationErrors = storyValidations.errorMessages;

      let authorNameMinimumLength = storyValidations.authorNameMinimumLength;
      let titleMinimumLength = storyValidations.titleMinimumLength;
      let storyNameMinimumLength = storyValidations.storyMinimumLength;

      console.log(`Story Written ${JSON.stringify(storyWritten)}`);
      if (storyWritten.author.length < authorNameMinimumLength) {
         this.showToastMessagesToUser(storyValidationErrors.authorNameTooShort)
         return false;
      } else if (storyWritten.title.length < titleMinimumLength) {
         this.showToastMessagesToUser(storyValidationErrors.titleTooShort)
         return false;
      } else if (storyWritten.story.length < storyNameMinimumLength) {
         this.showToastMessagesToUser(storyValidationErrors.storyTooShort)
         return false;
      }

      try {
         firebase.firestore().collection(GLOBALS.firestore.collections.stories).add({
            title: storyWritten.title,
            author: storyWritten.author,
            story: storyWritten.story
         });
         this.showToastMessagesToUser(GLOBALS.storySubmittedSuccesMessage);
      } catch (e) {
         this.showToastMessagesToUser(GLOBALS.errors.unknownError)
         return false;
      }

   }

   showToastMessagesToUser(message: string) {

      //Toast android doesn't work on any ohter thing than android
      if (Platform.OS == 'android') {
         ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
         alert(message);
      }

   }

   render() {
      let storyWritten: StoryDocument = {
         title: '',
         author: '',
         story: ''
      };

      let dimensions: ScaledSize = this.state.dimensions;
      let storyTextFieldSize: Size = { width: dimensions.width / 2, height: dimensions.height / 13 }
      let textFieldDataList: TextFieldData[] = [
         {
            height: storyTextFieldSize.height,
            placeholder: "Title",
            onChangeText: (text: string) => {
               storyWritten.title = text;
            },
         },
         {
            height: storyTextFieldSize.height,
            placeholder: "Author",
            onChangeText: (text: string) => {
               storyWritten.author = text;
            }
         },
         {
            height: dimensions.height / 2.15,
            placeholder: "Story",
            onChangeText: (text: string) => {
               storyWritten.story = text;
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
               onPress={() => this.validateAndSubmitStory(storyWritten)}
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