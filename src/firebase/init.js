import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: 'AIzaSyCjF1Ne0TV68ZezRs7B8wy90M7bmOB-K2o',
  authDomain: "food-affairs-53ae4.firebaseapp.com",
  projectId: "food-affairs-53ae4",
  storageBucket: "food-affairs-53ae4.appspot.com",
  messagingSenderId: "804679587609",
  appId: "1:804679587609:web:a65d79cdd97139777f1788",
};

initializeApp(firebaseConfig);

const db = getFirestore();
export default db;