import firebase from "firebase/app";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDa58-VPh-DI5A4HwLtctkwQs0LdnPLlOc",
    authDomain: "materias-mila.firebaseapp.com",
    projectId: "materias-mila",
    storageBucket: "materias-mila.appspot.com",
    messagingSenderId: "811030799720",
    appId: "1:811030799720:web:400daf4e9739b3f22362dd",
    measurementId: "G-PLL6S9KG1P",
};

if(firebase.apps.length){
    firebase.app()
}else{
    firebase.initializeApp(firebaseConfig)
}

const database = firebase.database()

export {database, firebase}