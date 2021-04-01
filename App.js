/* eslint-disable react/display-name */
import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/redux/store';
import Routes from './Routes';
import { StatusBar } from 'react-native';
import { colors } from './app.utils';

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<StatusBar
					animated={true}
					backgroundColor={colors.mainColor} />
				<Routes />
			</PersistGate>
		</Provider>
	);
};


export default App;
