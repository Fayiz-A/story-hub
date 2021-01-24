import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, FlatList, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import firebase from '../configs/firebase.config';
import GLOBALS from '../globals';
import CustomButton from '../components/CustomButton';

export interface Props {

}

export interface State {
   dimensions: ScaledSize,
   stories: StoryDocument[],
   displayStories: StoryDocument[]
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
         stories: [
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            }
         ],
         displayStories: [
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            },
            {
               author: "someone",
               title: "Lorem Ipsum",
               story: "In aliqua Lorem aliqua enim in do laboris sunt ea non culpa duis aliqua aliquip. In consectetur in non qui mollit pariatur ut sit. Aute eu nisi dolor exercitation. Incididunt in proident ullamco nostrud aliqua nisi exercitation duis voluptate. Veniam amet velit consequat irure cupidatat id magna Lorem incididunt Lorem aute occaecat."
            }
         ]
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
      await firebase.firestore().collection(GLOBALS.firestore.collections.stories).limit(15).get()
         .then(res => {
            let _stories: StoryDocument[] = [];

            res.docs.map(doc => {
               _stories.push({
                  author: doc.data().author,
                  title: doc.data().title,
                  story: doc.data().story
               })
            });

            this.setState({
               stories: _stories,
               displayStories: _stories
            })
         })
         .catch(err => {
            console.error(`Error occurred in fetching stories ${err}`);
         });
   }

   searchForStories(searchText:string) {
      let searchResults: StoryDocument[];

      searchResults = this.state.stories.filter((story:StoryDocument) => {
         if(story != null) {
            return story.title.trim().toLowerCase().includes(searchText.trim().toLowerCase())
         }
      });
      this.setState({
         displayStories: searchResults
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   render() {
      let dimensions:ScaledSize = this.state.dimensions;
      let searchText:string;
      return (
         <View style={responsiveStyles(dimensions).background}>
            <AppBar title="Read Story" />
            <View style={responsiveStyles(dimensions).storySearchBarContainer}>
               <TextField
                  textInputWidth={dimensions.width / 2}
                  textInputHeight={dimensions.height / 13}
                  onChangeText={(value:string) => {searchText=value}}
                  placeholder='Search for a story'
                  multiline={false}
                  borders={1}
               />
               <TouchableOpacity 
                  onPress = {() => this.searchForStories(searchText)}
                  style={responsiveStyles(dimensions).searchStoryButton}
               >
                  <Text style={responsiveStyles(dimensions).searchStoryButtonText}>Search</Text>
               </TouchableOpacity>
            </View>
            {
               this.state.stories.length == 0 ?
                  <View style={responsiveStyles(dimensions).activityIndicatorContainer}>
                     <ActivityIndicator animating={true} color="purple" size={dimensions.height/3}/>
                  </View> :
                  this.state.displayStories.length == 0 ?
                  <View style={responsiveStyles(dimensions).noStoriesFoundContainer}>
                     <Text style={responsiveStyles(dimensions).listTileTextTitle}>No Stories Found</Text>
                  </View> :
                  <FlatList
                     contentContainerStyle={{ paddingBottom: 100 }}
                     data={this.state.displayStories}
                     renderItem={({ index }) => <ListTile storyData={this.state.displayStories[index]} dimensions={dimensions} />}
                     keyExtractor={(item, index) => index.toString()}
                  />
            }
         </View>
      )
   }
}

const ListTile = ({ storyData, dimensions }: { storyData: StoryDocument, dimensions: ScaledSize }) => {

   let styles = responsiveStyles(dimensions);
   let letters = 'BCDEF'.split('');//light color hex codes
   let color = '#';
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
   }

   console.log(`Color: ${color}`)

   //this is being dynamically changed so it is written here
   let listTileContainer = {
      backgroundColor: `${color}`,
      marginTop: 15,
      marginHorizontal: 10,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 2,
      paddingLeft: 10,
      borderRadius: 10
   }

   return (
      <View style={listTileContainer}>
         <View style={styles.listTileTextContainer}>
            <Text style={styles.listTileTextTitle}>Title: </Text>
            <Text style={styles.listTileText}>{storyData.title}</Text>
         </View>
         <View>
            <View style={styles.listTileTextContainer}>
               <Text style={styles.listTileTextTitle}>Author: </Text>
               <Text style={styles.listTileText}>{storyData.author}</Text>
            </View>
         </View>
      </View>
   );
}

const responsiveStyles = (dimensions: ScaledSize) => StyleSheet.create({
   background: {
      height: dimensions.height,
      backgroundColor: "#ffe57f",
   },
   storySearchBarContainer: {
      flexDirection: "row",
      paddingTop: 20,
      paddingLeft: dimensions.width / 2 - (((dimensions.width / 2) / 2)+50) //dimensions.width / 2 is the width of storySearchBar and 50 is the touchable opacity width
   },
   searchStoryButton: {
      backgroundColor: "rgb(234, 111, 123)",
      justifyContent: "center",
      alignItems: "center",
      borderTopEndRadius: 200,
      borderBottomEndRadius: 200,
      paddingHorizontal: 10,
      borderColor: "black",
      borderTopWidth: 4,
      borderBottomWidth: 4,
      borderEndWidth: 4
   },
   searchStoryButtonText: {
      fontSize: dimensions.height / 30,
      color: "white"
   },
   noStoriesFoundContainer: {
      paddingLeft: 20,
      paddingTop: 20
   },
   listTileTextContainer: {
      flexDirection: "row",
      paddingVertical: 2,
   },
   listTileTextTitle: {
      fontWeight: "600",
      fontSize: GLOBALS.listTile.styles.font.size
   },
   listTileText: {
      fontSize: GLOBALS.listTile.styles.font.size
   },
   activityIndicatorContainer: {
      paddingTop: dimensions.height/2-((dimensions.height/3)/2), //(dimensions.height/3) is the diameter of the activity indicator
   },
})