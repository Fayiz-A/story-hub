import { createStore } from "redux";
import { ActionsType, WriteStoryStateInterface, WriteStoryActionInterface, StoryDocument } from "../types";
import GLOBALS from '../../globals';
import firebase from "firebase";

const writeStoryInitialState:WriteStoryStateInterface = {
   title: '',
   author: '',
   story: '',
   storySubmitted: false,
   storyTooShort: false,
   storyTitleTooShort: false,
   storyAuthorTooShort: false,
   validationsCleared: false,
}



const WriteStoryReducer = async (state:any = writeStoryInitialState, action: WriteStoryActionInterface) => {
   switch (action.type) {
      case ActionsType.validateAndSaveStoryToDatabase:
         return await validateAndSubmitStory(action.storyWritten);
      default:
         return state;
   }
}

async function validateAndSubmitStory (storyWritten: StoryDocument) {
   let storyValidations = GLOBALS.storyValidations;

   let authorNameMinimumLength = storyValidations.authorNameMinimumLength;
   let titleMinimumLength = storyValidations.titleMinimumLength;
   let storyNameMinimumLength = storyValidations.storyMinimumLength;

   console.log(`Story Written ${JSON.stringify(storyWritten)}`);

   let state:any = storyWritten;

   if (storyWritten.author.length < authorNameMinimumLength) {
      state.storyAuthorTooShort = true;
      state.storySubmitted = false;
      state.validationsCleared = false;
   } 
   else if (storyWritten.title.length < titleMinimumLength) {
      state.storyTitleTooShort = true;
      state.storySubmitted = false;
      state.validationsCleared = false;
   } 
   else if (storyWritten.story.length < storyNameMinimumLength) {
      state.storyTooShort = true;
      state.storySubmitted = false;
      state.validationsCleared = false;
   } else {
      state.validationsCleared = true;
   }

   if(state.validationsCleared == false) {
      console.log(`${JSON.stringify(state)} is state in progress in arrow method`);
      return state;
   }

   await firebase.firestore().collection(GLOBALS.firestore.collections.stories).add({
      title: storyWritten.title,
      author: storyWritten.author,
      story: storyWritten.story
   }).then(res=> {
      state.storySubmitted = true;
   }).catch(err => {
      console.error(`Error occured while submitting the story: ${err}`);
   })
   state.storySubmitted = false;
   return state;
}

export default WriteStoryReducer;