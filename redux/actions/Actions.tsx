import { ActionsType, StoryDocument, WriteStoryActionInterface } from '../types';

export const validateAndSaveStoryToDatabase = ( storyWritten:StoryDocument ):WriteStoryActionInterface => {
   console.log(`In validateAndSaveStoryToDatabase`)
   return {
      type: ActionsType.validateAndSaveStoryToDatabase,
      storyWritten: storyWritten
   }
}