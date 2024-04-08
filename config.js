//firebase config key setup

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import 'firebase/compat/database';
import { getDatabase, ref, push } from 'firebase/database'
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDSH1Ml1nYy3LRFK3SgEtV6zZEY9o5tV6s",
  authDomain: "test1-480ea.firebaseapp.com",
  databaseURL: "https://test1-480ea-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test1-480ea",
  storageBucket: "test1-480ea.appspot.com",
  messagingSenderId: "1076814421765",
  appId: "1:1076814421765:web:1497d9612d9aa6d37ae16c",
  measurementId: "G-DPX7XLG1MF"
};

if (firebase.apps.length === 0){
    firebase.initializeApp(firebaseConfig);
}

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const updateDatabaseWithPurchasedProducts = async (purchasedProducts) => {
  const databaseRef = ref(db, 'purchaseHistory/'); // Updated path to 'purchaseHistory/'
  try {
    await push(databaseRef, purchasedProducts); // Push the purchased products to the database
    return true; // Return true if the update is successful
  } catch (error) {
    console.error('Error updating database:', error);
    return false; // Return false if there's an error
  }
};

export { firebase, db, updateDatabaseWithPurchasedProducts };

