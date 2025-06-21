import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCHBY8LNNBYXBKw_lhwbK7zISUh1lljMkc",
  authDomain: "tremont-950e5.firebaseapp.com",
  projectId: "tremont-950e5",
  storageBucket: "tremont-950e5.firebasestorage.app",
  messagingSenderId: "649151542864",
  appId: "1:649151542864:web:3fead623df669210a40355",
  measurementId: "G-WDSQWHWG9S"
};



const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;