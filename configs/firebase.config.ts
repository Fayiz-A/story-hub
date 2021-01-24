import firebase from 'firebase';
// Your web app's Firebase configuration
let firebaseConfig:{} = {
   apiKey: "AIzaSyAvScS_wuEMwsA33Ob0w4TNCq6hIQi8sXM",
   authDomain: "story-hub-cb066.firebaseapp.com",
   projectId: "story-hub-cb066",
   storageBucket: "story-hub-cb066.appspot.com",
   messagingSenderId: "758016327958",
   appId: "1:758016327958:web:f324bfcceb0e6a0ff09037"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;