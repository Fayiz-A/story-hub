import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, ScaledSize, FlatList, Text, ActivityIndicator } from 'react-native';
import AppBar from '../components/AppBar';
import TextField from '../components/TextField';
import firebase from '../configs/firebase.config';
import GLOBALS from '../globals';

export interface Props {

}

export interface State {
   dimensions: ScaledSize,
   stories: StoryDocument[],
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
      await firebase.firestore().collection(GLOBALS.firestore.collections.stories).get()
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
               stories: _stories
            })
         })
         .catch(err => {
            console.error(`Error occurred in fetching stories ${err}`);
         });
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", ({ window, screen }) => {
         console.log(`Event listener for dimensions removed in WriteStoryScreen.tsx`)
      });
   }

   render() {

      return (
         <View style={responsiveStyles(this.state.dimensions).background}>
            <AppBar title="Read Story" />
            {
               this.state.stories.length == 0 ?
                  <View style={responsiveStyles(this.state.dimensions).activityIndicatorContainer}>
                     <ActivityIndicator animating={true} color="purple" size={this.state.dimensions.height/3}/>
                  </View> :
                  <FlatList
                     data={this.state.stories}
                     renderItem={({ index }) => <ListTile storyData={this.state.stories[index]} dimensions={this.state.dimensions} />}
                     keyExtractor={(item, index) => index.toString()}
                  />}
         </View>
      )
   }
}

const ListTile = ({ storyData, dimensions }: { storyData: StoryDocument, dimensions: ScaledSize }) => {

   let styles = responsiveStyles(dimensions);
   let letters = 'BCDEF'.split('');
   let color = '#';
   for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
   }

   console.log(`Color: ${color}`)

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
   listTile: {

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