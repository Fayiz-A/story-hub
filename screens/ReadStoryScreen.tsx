import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, FlatList, Text, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import firebase from '../configs/firebase.config';
import GLOBALS from '../globals';

import {
   NavigationParams,
   NavigationScreenProp,
   NavigationState,
 } from 'react-navigation';

export interface Props {
   navigation: NavigationScreenProp<any, any>
}

export interface State {
   dimensions: ScaledSize,
   stories: StoryDocument[],
   displayStories: StoryDocument[],
   lastVisibleStory: StoryDocument | null,
   searchText: string
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
         displayStories: [],
         lastVisibleStory: null,
         searchText: ""
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
      let limitValue = 10;
      let lastVisibleStory:StoryDocument|null = this.state.lastVisibleStory;

      let query = lastVisibleStory == null ? 
      firebase.firestore().collection(GLOBALS.firestore.collections.names.stories).orderBy(GLOBALS.firestore.collections.documents.fields.names.title).limit(limitValue)://query from the beginning
      firebase.firestore().collection(GLOBALS.firestore.collections.names.stories).orderBy(GLOBALS.firestore.collections.documents.fields.names.title).startAfter(lastVisibleStory.title).limit(limitValue);
      await query.get()
         .then(res => {
            let _stories: StoryDocument[] = [];

            res.docs.map(doc => {
               _stories.push({
                  author: doc.data().author,
                  title: doc.data().title,
                  story: doc.data().story
               })
            });
            
            _stories = [...this.state.stories, ..._stories];

            let lastVisibleStory = this.state.stories[this.state.stories.length - 1];
            this.setState({
               stories: _stories,
               displayStories: _stories,
               lastVisibleStory: lastVisibleStory,
            })
         })
         .catch(err => {
            console.error(`Error occurred in fetching stories ${err}`);
         });
   }

   searchForStories = async (searchText:string) => {
      let searchResults: StoryDocument[] = [];

      if(searchText.trim().length == 0) {
         searchResults = this.state.stories;
      } else {
         await firebase.firestore().collection(GLOBALS.firestore.collections.names.stories).where(GLOBALS.firestore.collections.documents.fields.names.title, "==", searchText.trim()).get()
         .then(res => {
            res.docs.map((doc) => searchResults.push({
               author: doc.data().author,
               title: doc.data().title,
               story: doc.data().story
            }));
         }).catch(err => {
            console.error(`Error occurred in querying stories ${err}`);
            alert(`Some error occurred!`)
         })
      }

      this.setState({
         displayStories: searchResults,
         searchText: searchText
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   render() {
      let dimensions:ScaledSize = this.state.dimensions;
      let searchText:string = this.state.searchText;
      return (
         //if the content becomes too big, the page will be srollable
         <ScrollView>
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
                     onPress = {() => {this.searchForStories(searchText)}}
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
                        renderItem={({ index }) => <ListTile storyData={this.state.displayStories[index]} dimensions={dimensions} props={this.props}/>}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={100}
                        onEndReached={() => searchText.trim().length == 0 ? this.getAllStoriesFromFirestore():console.log(`No need to fetch!`)}
                     />
               }
            </View>
         </ScrollView>
      )
   }
}

const ListTile = ({ storyData, dimensions, props }: { storyData: StoryDocument, dimensions: ScaledSize, props:Props }) => {

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
      <TouchableOpacity
         onPress={() => {props.navigation.navigate({routeName: "StoryContentScreen", params: {story: storyData}})}}
      >
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
      </TouchableOpacity>
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