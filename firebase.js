// import firebase from "firebase/compat/app";
// import "firebase/compat/auth";
// import "firebase/compat/firestore";
// import "firebase/compat/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBYes3lowXaRByj2aWxv5-kOuwzz3cFIxI",
//   authDomain: "test-a9d9c.firebaseapp.com",
//   projectId: "test-a9d9c",
//   storageBucket: "test-a9d9c.appspot.com",
//   messagingSenderId: "146469040983",
//   appId: "1:146469040983:web:68c966af8df1aec3be8412",
// };

// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// }
// export { firebase };

import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId,
};
console.log("This is firebasConfig", firebaseConfig);

// initialize firebase
const app = initializeApp(firebaseConfig);

//instead of using firebase.auth() we use initializeAuth
// initialize auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);
console.log("This is auth", auth);

export const db = getFirestore(app);
// export const storageRef = ref(storage);
