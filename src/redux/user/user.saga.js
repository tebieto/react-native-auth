import { takeLatest, call, all, put } from 'redux-saga/effects';

import UserActionTypes from './user.types';

import {
	signInSuccess,
	signInFailure,
	signOutSuccess,
	signOutFailure,
	signUpFailure,
	signUpSuccess,
	connectingToServer,
	toggleSubmittingLogin,
	toggleSubmittingRegister,
	initiatePayment,
	storeActiveRequest,
	openRequestView,
	setPeer,
	storeRequests,
} from './user.action';

import {
	auth,
	googleProvider,
	createUserProfileDocument,
	getcurrentUser,
	getCurrentUserRequests,
} from '../../firebase/firebase.utils';

export function* initiatePaymentStart({ payload }) {
	const { type } = payload;
	yield put(initiatePayment(type));
}

export function* getSnapShotFromUserAuth(userAuth, additionalData) {
	try {
		const userRef = yield call(
			createUserProfileDocument,
			userAuth,
			additionalData,
		);
		const userSnapshot = yield userRef.get();
		yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data() }));
		yield put(connectingToServer(false));
		const currentUser = userSnapshot.data();
		const currentUserRequests = yield getCurrentUserRequests(currentUser);

		if (currentUserRequests) {
			const { requests, peer, requestView, activeRequest } = currentUserRequests;

			if (requestView && activeRequest && peer) {
				yield put(openRequestView(requestView));
				yield put(storeActiveRequest(activeRequest));
				yield put(setPeer(peer));
			}

			if (requests) {
				yield put(storeRequests(requests));
			}
		}

		return userSnapshot;
	} catch (error) {
		alert(error);
		yield put(signInFailure(error));
	}
}

export function* signInWithGoogle() {
	try {
		const { user } = yield auth.signInWithPopup(googleProvider);
		yield getSnapShotFromUserAuth(user);
	} catch (error) {
		alert(error);
		yield put(signInFailure(error));
	}
}

export function* signInWithEmail({ payload: { email, password } }) {
	try {
		yield put(toggleSubmittingLogin(true));
		const { user } = yield auth.signInWithEmailAndPassword(email, password);
		yield getSnapShotFromUserAuth(user);
	} catch (error) {
		alert(error);
		yield put(signInFailure(error));
	}
}

export function* isUserAuthenticated({ hideLoader }) {
	try {
		if (!hideLoader) {
			yield put(connectingToServer(true));
		}
		const userAuth = yield getcurrentUser();
		if (!userAuth) {
			yield put(signInFailure('User not found'));
			return;
		}
		yield getSnapShotFromUserAuth(userAuth);
	} catch (error) {
		alert(error);
		yield put(signInFailure(error));
	}
}

export function* signOut() {
	try {
		yield auth.signOut();
		yield put(signOutSuccess());
	} catch (error) {
		alert(error);
		yield put(signOutFailure(error));
	}
}

export function* signUp({ payload: { email, password, ...additionalDatas } }) {
	try {
		yield put(toggleSubmittingRegister(true));
		const { user } = yield auth.createUserWithEmailAndPassword(email, password);
		yield put(
			signUpSuccess({
				user,
				additionalData: { ...additionalDatas, appMode: 'default' },
			}),
		);
	} catch (error) {
		alert(error);
		yield put(signUpFailure(error));
	}
}

export function* signInAfterSignUp({ payload: { user, additionalData } }) {
	try {
		yield getSnapShotFromUserAuth(user, additionalData);
	} catch (error) {
		alert(error);
		yield put(signUpFailure(error));
	}
}

export function* onGoogleSignInStart() {
	yield takeLatest(UserActionTypes.GOOGLE_SIGN_IN_START, signInWithGoogle);
}

export function* onEmailSignInStart() {
	yield takeLatest(UserActionTypes.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onCheckUserSession() {
	yield takeLatest(UserActionTypes.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onSignOutStart() {
	yield takeLatest(UserActionTypes.SIGN_OUT_START, signOut);
}

export function* onSignUpStart() {
	yield takeLatest(UserActionTypes.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
	yield takeLatest(UserActionTypes.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* userSagas() {
	yield all([
		call(onCheckUserSession),
		call(onGoogleSignInStart),
		call(onEmailSignInStart),
		call(onSignOutStart),
		call(onSignUpStart),
		call(onSignUpSuccess),
	]);
}
