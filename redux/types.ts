export enum ActionsType { 
   validateAndSaveStoryToDatabase 
}

export interface Actions {
   type: ActionsType
}

export interface WriteStoryStateInterface {
   author: string,
   title: string,
   story: string
}