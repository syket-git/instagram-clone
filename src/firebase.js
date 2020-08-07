import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBuuzEhuBZWq1W8-G0nnw6IwyCcNEXTS4M",
    authDomain: "instagram-clone90.firebaseapp.com",
    databaseURL: "https://instagram-clone90.firebaseio.com",
    projectId: "instagram-clone90",
    storageBucket: "instagram-clone90.appspot.com",
    messagingSenderId: "372534892664",
    appId: "1:372534892664:web:bca634d508e685cdd7f58d",
    measurementId: "G-4JXNSM3WWW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db , auth, storage}