import * as FirebaseModule from 'firebase';
import firebaseConfig from '../config/firebase';

const {
  apiKey,
  authDomain,
  databaseURL,
  storageBucket,
  messagingSenderId,
} = firebaseConfig.web;

let firebaseInitialized = false;

if (
  apiKey !== 'null'
  && authDomain !== 'null'
  && databaseURL !== 'null'
  && storageBucket !== 'null'
  && messagingSenderId !== 'null'
) {
  FirebaseModule.initializeApp(firebaseConfig.web);
  firebaseInitialized = true;
}

export const FirebaseRef = firebaseInitialized ? FirebaseModule.database().ref() : null;
export const Firebase = firebaseInitialized ? FirebaseModule : null;
// export const FirebaseMessaging = firebaseInitialized ? FirebaseModule.messaging() : null;