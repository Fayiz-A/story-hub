export enum ActionsType { 
   validateAndSaveStoryToDatabase 
}

export interface StoryDocument {
   author: string,
   title: string,
   story: string,
}

export interface WriteStoryActionInterface {
   storyWritten: StoryDocument,
   type:ActionsType
}

export interface WriteStoryStateInterface {
   author: string,
   title: string,
   story: string,
   storySubmitted: boolean,
   storyTooShort: boolean,
   storyTitleTooShort: boolean,
   storyAuthorTooShort: boolean,
   validationsCleared: boolean
}