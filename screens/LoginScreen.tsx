import React from "react";
import { View, ScaledSize, Text, Image, Dimensions, StyleSheet, TextInput, KeyboardType, Keyboard } from "react-native";
import AppBar from "../components/AppBar";
import CustomButton from "../components/CustomButton";
import firebase from "../configs/firebase.config";
import { Snackbar } from "react-native-paper";
import validator from "email-validator";
import GLOBALS from "../globals";
import { NavigationScreenProp } from "react-navigation";

export interface Props {
   navigation: NavigationScreenProp<any, any>
}

export interface State {
   dimensions: ScaledSize,
   snackBarVisible: boolean,
   snackbarMessage: string,
   email: string,
   password: string
}

interface TextInputDetails {
   details: TextInputDetailsList[]
}

interface TextInputDetailsList {
   keyboardType: KeyboardType,
   onChangeText: (text:string) => void,
   placeholder: string,
   secureTextEntry: boolean,
}

export default class LoginScreen extends React.Component<Props, State> {

   constructor(props:Props, state:State) {
      super(props, state);

      this.state = {
         dimensions: Dimensions.get("window"),
         snackBarVisible: false,
         snackbarMessage: '',
         email: '',
         password: ''
      }
   }

   componentDidMount() {
      Dimensions.addEventListener("change", ({ window, screen }) => {
         this.setState({
            dimensions: window
         })
      })
   }

   componentWillUnmount() {
      Dimensions.removeEventListener("change", () => console.log(`Event listener for dimensions removed in LoginScreen.tsx`));
   }

   validateUser = async (email: string, password: string):Promise<string> => {

      try {
         email = email.trim();
         password = password.trim();         
         console.log(`Email is: ${email}, password is: ${password}`);
         
         if(email.length == 0) {
            return `Please enter the email`
         } else if(validator.validate(email) == false) {
            return `Please enter a valid email`
         } else if(password.length == 0) {
            return `Please enter the password`
         }

         await firebase.auth().signInWithEmailAndPassword(email, password);

         return GLOBALS.success;
      } catch(e) {
         console.log(`Auth failed because of ${JSON.stringify(e)}`)

         switch(e.code) {
            case 'auth/invalid-email':
               return`Please enter a valid email`;
            case 'auth/user-not-found':
               return`User not found.`;
            case 'auth/wrong-password':
               return `Wrong password`;
            default: return `Some error occured`;
         }
      }
   }

   showSnackbar = (snackbarMessage: string) => this.setState({
      snackBarVisible: true,
      snackbarMessage: snackbarMessage
   });

   onSnackbarDismiss = () => this.setState({snackBarVisible: false})
   render() {
      let dimensions = this.state.dimensions;

      let email:string = this.state.email;
      let password:string = this.state.password;

      let textInputDetails: TextInputDetails = {
         details: [
            {
               keyboardType: 'email-address',
               placeholder: 'Email',
               onChangeText: (text:string) => email = text,
               secureTextEntry: false
            },
            {
               keyboardType: 'default',
               placeholder: 'Password',
               onChangeText: (text:string) => password = text,
               secureTextEntry: true
            }
         ]
      }

      return (
         <View style={responsiveStyles(dimensions).background}>
            <AppBar title='Bedtime Stories'/>
            <View style={responsiveStyles(dimensions).imageContainer}>
               <Image source={{
                  uri: 'https://image.freepik.com/free-vector/crescent-moon-stars-clear-sky-background_1017-26919.jpg', 
                  width: dimensions.width / 3,
                  height: dimensions.height / 4
               }}/>
            </View>
            <View>
               {
                  textInputDetails.details.map((textInput, index) => 
                     <View style={responsiveStyles(dimensions).textInputContainer}>
                        <TextInput 
                           style={responsiveStyles(dimensions).textInput}
                           placeholder={textInput.placeholder}
                           onChangeText = {textInput.onChangeText}
                           secureTextEntry={textInput.secureTextEntry}
                        />
                     </View>
                  )
               }
            </View>
            <View>
               <CustomButton 
                  title='Submit' 
                  width={100}
                  paddingLeft={(dimensions.width / 2) - (100 / 2)}
                  color='red'
                  paddingTop={20}
                  onPress={async () => {
                     let snackbarMessage:string = await this.validateUser(email, password);
                     this.setState({email:email, password:password});
                     if(snackbarMessage == GLOBALS.success) this.props.navigation.navigate({routeName: 'PlatformScreen'})
                     this.showSnackbar(snackbarMessage);
                  }}
               />
            </View>
            <Snackbar
               visible={this.state.snackBarVisible}
               onDismiss={this.onSnackbarDismiss}
               action={{
                  onPress: this.onSnackbarDismiss,
                  label: 'Dismiss'
               }}
            >
               {this.state.snackbarMessage}
            </Snackbar>
         </View>
      )

   }
}

const responsiveStyles = (dimensions: ScaledSize) => StyleSheet.create({
   background: {
      backgroundColor: 'rgb(34, 64, 84)',
      height: dimensions.height
   },
   imageContainer: {
      marginLeft: (dimensions.width / 2) - ((dimensions.width / 3) / 2),
      marginRight: ((dimensions.width / 2) - ((dimensions.width / 3) / 2))-8,//hardcoded 8 for adjustments. Doesn't affect responsiveness
      marginTop: 20,
      borderWidth: 4,
      borderRadius: 15,
      borderColor: 'black'
   },
   textInputContainer: {
      marginTop: 30,
      marginLeft: (dimensions.width / 2) - ((dimensions.width / 3) / 2)//dimensions.width / 3 is the width of text input
   },
   textInput: {
      width: dimensions.width / 3,
      borderWidth: 4,
      borderColor: 'black',
      padding: 5,
      fontSize: 25,
      color: 'white',
      borderRadius: 100,
   }
})