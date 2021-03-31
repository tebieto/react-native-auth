import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
	'apiKey': 'AIzaSyDTVvplA9keF3i-JyR_UP2W6lIKeosGF9U',
	'authDomain': 'aphorusproduction.firebaseapp.com',
	'databaseURL': 'https://aphorusproduction.firebaseio.com',
	'projectId': 'aphorusproduction',
	'storageBucket': 'aphorusproduction.appspot.com',
	'messagingSenderId': '1092493995658',
	'appId': '1:1092493995658:web:92c3738b87321c04300773',
	'measurementId': 'G-XWNESY500T'
};

try {
	firebase.initializeApp(config);
} catch(error) {
	console.log(error);
}


export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export const createUserProfileDocument = async (userAuth, additionalData) => {
	if (!userAuth) return;
	const { displayName, email, uid } = userAuth;
	const userRef = firestore.doc(`users/${uid}`);

	const snapShot = await userRef.get();

	if(!snapShot.exists) {
		const createdAt = Date.now();

		await userRef.set({
			id: uid,
			full_name: displayName,
			email,
			avatar: null,
			security_officer: false,
			account_balance: 0,
			subscription: {
				plan: null,
				type: null,
				expiration_date: null
			},
			cards: {
				all: null,
				current: null
			},
			payment_tokens: {
				all: null,
				current: null
			},
			banks: null,
			created_at: createdAt,
			...additionalData
		});
	}
		
	return userRef;
    
};

export const getcurrentUser = () => {
	return new Promise((resolve, reject) => {
		const unsubscribe = auth.onAuthStateChanged(userAuth => {
			unsubscribe();
			resolve(userAuth);
		}, reject);
	});
};

export default firebase;