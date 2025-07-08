import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'

export const app = firebase.initializeApp({
    "projectId": "juego-c7d80",
    "appId": "1:298497381415:web:19d39ed921c48cbc386a02",
    "storageBucket": "juego-c7d80.appspot.com",
    "locationId": "europe-west2",
    "apiKey": "AIzaSyApOPXEwlwUPYwt22Vu3dNzJaKuerokfKY",
    "authDomain": "juego-c7d80.firebaseapp.com",
    "messagingSenderId": "298497381415"
  });