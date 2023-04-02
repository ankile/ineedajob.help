import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC2wJMx4jj5sEt3BXyb2CUmqXgBl_Kcfm8",
    authDomain: "i-need-a-job.firebaseapp.com",
    projectId: "i-need-a-job",
    storageBucket: "i-need-a-job.appspot.com",
    messagingSenderId: "691873428802",
    appId: "1:691873428802:web:759b6810b27094a89684db",
    measurementId: "G-H3DPEZ1JY1"
  };


const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

export { storage, auth, firebaseApp as default};
