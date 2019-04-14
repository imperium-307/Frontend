import app from 'firebase/app';
import 'firebase/auth';
//<script src="https://www.gstatic.com/firebasejs/5.8.2/firebase.js"></script>
//<script>
// Initialize Firebase
const config = {
	apiKey: "AIzaSyAFCjV3tY0fecgQTYCsH2J3AaHI6KPQpmU",
	authDomain: "imperium-ab01e.firebaseapp.com",
	databaseURL: "https://imperium-ab01e.firebaseio.com",
	projectId: "imperium-ab01e",
	storageBucket: "imperium-ab01e.appspot.com",
	messagingSenderId: "625794855499"
};
//firebase.initializeApp(config);
//</script>
class Firebase{
	constructor(){
		app.initializeApp(config);

		this.auth = app.auth();
	}

	doCreateUserWithEmailAndPassword = (email, password) =>
		this.auth.createUserWithEmailAndPassword(email, password);

	doSignInWithEmailAndPassword = (email, password) =>
		this.auth.signInWithEmailAndPassword(email, password);

	doSignOut = () => this.auth.signOut();

	doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

	doPasswordUpdate = password =>
		this.auth.currentUser.updatePassword(password);
}


export default Firebase;
