import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";

export function initialize() {
  const config = {
    apiKey: "AIzaSyB6VbyTfEmqscCaA-ihdYjlOhcE1v3-4Dc",
    authDomain: "deerbot-project.firebaseapp.com",
    databaseURL: "https://deerbot-project.firebaseio.com",
    messagingSenderId: "257195103524",
    projectId: "deerbot-project",
    storageBucket: "deerbot-project.appspot.com"
  };

  const app = firebase.initializeApp(config);

  // const settings = { timestampsInSnapshots: true };
  // app.firestore().settings(settings);

  return app;
}

export async function signin(
  email: string,
  password: string
): Promise<boolean> {
  try {
    const userCred = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);
    return userCred.user ? userCred.user.emailVerified : false;
  } catch (error) {
    throw error;
  }
}

export async function signout() {
  return firebase.auth().signOut();
}

export function presence() {
  firebase.auth().onAuthStateChanged(user => {
    if (!user) {
      return;
    }
    // Fetch the current user's ID from Firebase Authenticfiresation.
    const uid = user.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    const userStatusDatabaseRef = firebase.database().ref(`/status/${uid}`);

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    const isOfflineForDatabase = {
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      state: "offline"
    };

    const isOnlineForDatabase = {
      last_changed: firebase.database.ServerValue.TIMESTAMP,
      state: "online"
    };

    // Create a reference to the special '.info/connected' path in
    // Realtime Database. This path returns `true` when connected
    // and `false` when disconnected.
    firebase
      .database()
      .ref(".info/connected")
      .on("value", snapshot => {
        // If we're not currently connected, don't do anything.
        if (snapshot && snapshot.val() === false) {
          return;
        }

        // If we are currently connected, then use the 'onDisconnect()'
        // method to add a set which will only trigger once this
        // client has disconnected by closing the app,
        // losing internet, or any other means.
        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect()
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            userStatusDatabaseRef.set(isOnlineForDatabase);
          });
      });
  });
}
