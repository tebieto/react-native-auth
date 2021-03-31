/* eslint-disable react/display-name */
import React from 'react';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './src/redux/store';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './src/screens/sign-up/sign-up.component';
import SignInScreen from './src/screens/sign-in/sign-in.component';
import HomeScreen from './src/screens/home/home.component';
import { StatusBar } from 'react-native';
import WelcomeScreen from './src/screens/welcome/welcome.componet';

const Stack = createStackNavigator();

const mainColor = 'purple';
const whiteColor = 'white';
const options = { 
	title: '', 
	headerStyle: { backgroundColor: mainColor } ,
	headerTintColor: whiteColor
};

const App = () => {
	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				<StatusBar
					animated={true}
					backgroundColor={mainColor} />
				<NavigationContainer>
					<Stack.Navigator>
						<Stack.Screen
							name="Welcome"
							component={WelcomeScreen}
							options={options}
						/>
						<Stack.Screen
							name="Home"
							component={HomeScreen}
						/>
						<Stack.Screen name="SignUp" options={options} component={SignUpScreen} />
						<Stack.Screen name="SignIn" options={options} component={SignInScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			</PersistGate>
		</Provider>
	);
};

export default App;
