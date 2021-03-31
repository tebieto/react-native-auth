/* eslint-disable react/display-name */
import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/redux/store';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/Home/home.component';
import SignUpScreen from './src/screens/sign-up/sign-up.component';

const Stack = createStackNavigator();

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Welcome"
							component={HomeScreen}
						/>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
							options={{ title: 'Home' }}
						/>
						<Stack.Screen name="Sign Up" component={SignUpScreen} />
						<Stack.Screen name="Sign In" component={SignUpScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default App;
