import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
	apiKey: 'AIzaSyDo2P3RalHW3JDXOON6vci3vyRzf_NiYtQ',
	authDomain: 'rnauth-f1a25.firebaseapp.com',
	projectId: 'rnauth-f1a25',
	storageBucket: 'rnauth-f1a25.appspot.com',
	messagingSenderId: '1012673407946',
	appId: '1:1012673407946:web:f32370e5c9a37fc717fd33'
};

try {
	!firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
} catch(error) {
	console.log(error);
}


export const firestore = firebase.firestore();
firestore.settings({ experimentalForceLongPolling: true });
export const auth = firebase.auth();

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
			created_at: createdAt,
			updated_at: createdAt,
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