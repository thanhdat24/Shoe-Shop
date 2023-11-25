// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBLEpgSW_XuzVcFKkceXPK4ycQXLpQkKTw',
  authDomain: 'shoes-144f4.firebaseapp.com',
  projectId: 'shoes-144f4',
  storageBucket: 'shoes-144f4.appspot.com',
  messagingSenderId: '510157437023',
  appId: '1:510157437023:web:ac797b80a946c46be0c3ea',
  measurementId: 'G-069RTSHWQC',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const AUTH = getAuth(app);
AUTH.languageCode = 'vi';
