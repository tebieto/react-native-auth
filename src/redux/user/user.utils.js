export const getUsersFromSnapShot = async (snapshot, payload) => {
	const { currentUser } = payload;
	if (!currentUser) {
		return [];
	}
	let user = [];
	await snapshot.forEach(doc => {
		let userData = doc.data();
		let invalid = currentUser.id === userData.id;
		if (invalid) {
			return;
		}
		user.push(userData);
	});
	return user;
};
