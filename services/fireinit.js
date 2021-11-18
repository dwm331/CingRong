
// Before: version 8 (Old)import firebase from 'firebase/app';
// import firebase from 'firebase/app';
// import 'firebase/auth'
// import 'firebase/database'

// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

let config = {
  apiKey: "AIzaSyDK3syIsZD7QVpU3WZqPWIhYWFc0fY5MNs",
  authDomain: "cingrong-b8eed.firebaseapp.com",
  databaseURL: "https://cingrong-b8eed-default-rtdb.firebaseio.com",
}

!firebase.apps.length ? firebase.initializeApp(config) : ''
export const auth = firebase.auth()
export const DB = firebase.database()
export default firebase
