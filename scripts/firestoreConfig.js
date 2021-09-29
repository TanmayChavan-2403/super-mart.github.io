// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBV07pw-48zo1B-PerAFk46OzvIoX6raZs",
    authDomain: "super-mart-7041a.firebaseapp.com",
    projectId: "super-mart-7041a",
    storageBucket: "super-mart-7041a.appspot.com",
    messagingSenderId: "183318334008",
    appId: "1:183318334008:web:7486f4035fab07150834cd"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);






















































function isMasterLogin(username, password, returnVal){
    if(username == 'Hackytech' && password == 'Hackytech@0000'){
        returnVal(true);
    } else {
        returnVal(false);
    }

}