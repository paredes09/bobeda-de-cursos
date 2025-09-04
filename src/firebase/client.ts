import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDLAakE44inn6PL42yVqoEhPdxNqFHM_so",
  authDomain: "boveda-de-cursos.firebaseapp.com",
  projectId: "boveda-de-cursos",
  storageBucket: "boveda-de-cursos.firebasestorage.app",
  messagingSenderId: "775678158106",
  appId: "1:775678158106:web:77b7c8521fbd04c980f8a3",
  measurementId: "G-P08Y08L59Y"
};

export const app = initializeApp(firebaseConfig);

export const projectAuth = getAuth(app);