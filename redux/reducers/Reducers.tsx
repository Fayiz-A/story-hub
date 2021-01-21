import { createStore } from "redux";
import { ActionsType, WriteStoryStateInterface , Actions} from "../types";

const writeStoryInitialState:WriteStoryStateInterface = {
   title: 'init',
   author: 'init',
   story: 'init'
}

const WriteStoryReducer = (state:WriteStoryStateInterface = writeStoryInitialState, action: Actions) => {
   switch (action.type) {
      case ActionsType.validateAndSaveStoryToDatabase:
         state.title = "abc";
         state.author = "abc";
         state.story = "abc"
         return state
      default:
         return state;
   }
}

export default WriteStoryReducer;