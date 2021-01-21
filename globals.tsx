export default {
   readScreenName: "Read Story",
   writeScreenName: "Write Story",
   firestore: {
      collections: {
         stories: "stories"
      }
   },
   storySubmittedSuccesMessage: "Your story has been submitted successfully!",
   storyValidations: {
      //how much the length should atleast be
      authorNameMinimumLength: 2,
      titleMinimumLength: 2,
      storyMinimumLength: 50,
      errorMessages: {
         authorNameTooShort: "I have never heard an author name so short like this! 🤔 According to me, a name should atleast be of 2 letters.",
         storyTooShort: "The story content is too short. The readers may not read such a short story! According to my experience, it should be of 50 words ateast.",
         titleTooShort: "The title is too short! It should be descriptive and of atleast 2 letters."
      }
   },

   errors: {
      unknownError: ""
   }
}