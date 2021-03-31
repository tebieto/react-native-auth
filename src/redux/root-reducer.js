import { AsyncStorage } from 'react-native';
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import userReducer from './user/user.reducer';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	blacklist: ['user'],
};

const rootReducer = combineReducers({
	user: userReducer,
});

export default persistReducer(persistConfig, rootReducer);
