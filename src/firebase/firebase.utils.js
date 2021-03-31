import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { rewardMessage, firebaseConfig } from '../../config.json';

const config = firebaseConfig;

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

export const updateUserInformation = async ({ userId, ...info }) => {

	if(!info) return; 

	const userRef = firestore.doc(`users/${userId}`);
	const snapShot = await userRef.get();

	if(snapShot.exists) {
		const updatedDetails = {
			...snapShot.data(),
			...info,
			updated_at: Date.now()
		};

		userRef.set(updatedDetails);
		
		return updatedDetails;
	}

};

export const addRewardToResponderBalance = async payload => {
	const { reward, responderId } = payload;

	if(!reward || !responderId) return; 

	const userRef = firestore.doc(`users/${responderId}`);
	const snapShot = await userRef.get();

	if(snapShot.exists) {
		const user = snapShot.data();
		let previous_balance =  user.account_balance;
		if(!previous_balance) previous_balance = 0;
		const account_balance = previous_balance + reward;

		userRef.set({
			...user,
			account_balance,
			updated_at: Date.now(),
		});

		const rewardRef = firestore.collection('rewards');

		const newRewardRef = rewardRef.doc();
		
		const newReward = { 
			...payload, 
			id: newRewardRef.id, 
			previous_balance, 
			new_balance: account_balance, 
			message: rewardMessage,
			created_at: Date.now() 
		};

		newRewardRef.set({
			...newReward
		});
		
		return newReward;
	}

};

export const saveRequest = async payload => {
	if (!payload.saveRequest) return;
	const requestRef = firestore.collection('requests');

	const newRequestRef = requestRef.doc();
	
	const handledCase = { sender: null, receiver: null };
	const request = { 
		...payload, 
		id: newRequestRef.id, 
		handledCase, peers: null, 
		created_at: Date.now() 
	};

	newRequestRef.set({
		...request,
	});

	return request;  
};

export const updateRequest = async payload => {
	if (!payload.updateRequest) return;
	const requestRef = firestore.doc(`requests/${payload.id}`);

	const snapShot = await requestRef.get();

	if(!snapShot.exists) return null;

	requestRef.set({
		...payload,
		updated_at: Date.now()
	});

	return payload;  
};

export const getcurrentUser = () => {
	return new Promise((resolve, reject) => {
		const unsubscribe = auth.onAuthStateChanged(userAuth => {
			unsubscribe();
			resolve(userAuth);
		}, reject);
	});
};

export const getCurrentUserRequests = async currentUser => {
	if(!currentUser) return;
	
	const availableRequests = await firestore.collection('requests').get();

	if(!availableRequests.size) return;

	const { id, station_id } = currentUser;

	let requestSnapShot;

	if(currentUser.security_officer) {
		requestSnapShot = await firestore.collection('requests').where('station_id', '==', station_id).get();
	} else {
		requestSnapShot = await firestore.collection('requests').where('requester', '==', id).get();
	}

	let requests = [];
	if(requestSnapShot) return null;
	requestSnapShot.forEach(doc => requests.push(doc.data()));

	const activeRequest = requests.filter(request => {
		if(request.isCancelledBy) return false;
		if(!request.requester || !request.responder) return false;
		if(request.requester !== id && request.responder !== id) return false;
		if(request.requester === id && !request.isCompleted.requester) return true;
		if(request.responder === id && !request.isCompleted.responder) return true;
	})[0];

	let requestView;
	let peer;

	if(activeRequest) {
		requestView = activeRequest.responder === id ? 'incoming-request' : 'outgoing-request';
		peer = activeRequest.responder === id ? activeRequest.requesterDetails  : activeRequest.responderDetails ;
	}

	if(!requests.length) requests = null;

	return { requests, activeRequest, requestView, peer };


};

export const addSecurityofficer = async payload => {
	const { user, currentUser } = payload;
	if (!user || !currentUser) return;
	const userRef = firestore.doc(`users/${user.id}`);
	const snapShot = await userRef.get();
	if(snapShot.exists) {
		const updatedAt = Date.now();
		const updatedUser = {
			...user,
			security_officer: true,
			verified: false,
			addedBy: currentUser.id,
			station_id: currentUser.station_id,
			updated_at: updatedAt,
		};
		await userRef.set(updatedUser);
		return updatedUser;
	}
};

export const removeSecurityofficer = async payload => {
	const { user, currentUser } = payload;
	if (!currentUser || !user || !user.addedBy || !currentUser.security_manager || currentUser.id !== user.addedBy) return alert('You are not allowed to do this');
	
	const userRef = firestore.doc(`users/${user.id}`);

	const snapShot = await userRef.get();

	if(snapShot.exists) {
		const updatedAt = Date.now();
		const updatedUser = {
			...user,
			security_officer: false,
			updated_at: updatedAt,
		};
		await userRef.set(updatedUser);
		return updatedUser;
	}
};

export const storeAddressInDatabase = async payload => {
	const { position, address, location, currentUser } = payload;
	if(!position || !address || !currentUser || !location) return;

	const { longitude, latitude } = position;
	
	const userRef = firestore.doc(`users/${currentUser.id}`);

	const snapShot = await userRef.get();

	if(snapShot.exists) {
		const updatedAt = Date.now();
		const updatedUser = {
			...snapShot.data(),
			location,
			address,
			position: { longitude, latitude },
			updated_at: updatedAt,
		};

		await userRef.set(updatedUser);
		return updatedUser;
	}
};

export const incomingRequestIsValid = async requestId => {
	const requestSnapShot = await firestore.collection('requests').where('id', '==', requestId).where('responder', '==', null).get();
	let request = [];
	requestSnapShot.forEach(doc => request.push(doc.data()));
	return request.length;
};



export default firebase;