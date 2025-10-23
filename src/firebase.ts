import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBXMeUSaK2-rFAI3JZD8KWEc9rRuYahA-I",
  authDomain: "hackare3acm.firebaseapp.com",
  databaseURL: "https://hackare3acm-default-rtdb.firebaseio.com/",
  projectId: "hackare3acm",
  storageBucket: "hackare3acm.firebasestorage.app",
  messagingSenderId: "1035547195842",
  appId: "1:1035547195842:web:8c5bfbe4ba7e775bb7ed95"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();
