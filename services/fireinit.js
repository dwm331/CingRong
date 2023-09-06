import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDi7nLofxFIQ9U8WwfRTe4wElZ3FOPm6a0",
  authDomain: "cingrong-b8eed.firebaseapp.com",
  databaseURL: "https://cingrong-b8eed-default-rtdb.firebaseio.com",
  projectId: "cingrong-b8eed",
  storageBucket: "cingrong-b8eed.appspot.com",
  messagingSenderId: "272965203319",
  appId: "1:272965203319:web:b5e7be36391905a25e5d72"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig)
export const auth = getAuth(firebase);
export const DB = getDatabase(firebase);
export default firebase

