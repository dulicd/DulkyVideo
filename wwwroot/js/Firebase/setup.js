// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyAsnnNV7A7ANjNrumcyAabR8LAFjIr2gKo",
    authDomain: "dulkyvideo.firebaseapp.com",
    databaseURL: "https://dulkyvideo.firebaseio.com",
    projectId: "dulkyvideo",
    storageBucket: "dulkyvideo.appspot.com",
    messagingSenderId: "395560034625",
    appId: "1:395560034625:web:1b3db4fd2aff94148141c0",
    //measurementId: "G-N31W2998RW"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();
const messaging = firebase.messaging();


messaging.onMessage(function (payload) {
    console.log('onMessage: ', payload);
    $(".ringing").removeAttr('hidden');
    localStorage.setItem("roomNameNotification", payload.notification.body);
});