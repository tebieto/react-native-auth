import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from './src/screens/sign-up/sign-up.component';
import SignInScreen from './src/screens/sign-in/sign-in.component';
import HomeScreen from './src/screens/home/home.component';
import WelcomeScreen from './src/screens/welcome/welcome.componet';
import { connect } from 'react-redux';
import { selectConnectionStatus, selectCurrentUser } from './src/redux/user/user.selector';
import { createStructuredSelector } from 'reselect';
import { colors } from './app.utils';
import { checkUserSession } from './src/redux/user/user.action';
import { useEffect } from 'react';
import Loader from './src/components/loader/loader.component';


const Stack = createStackNavigator();

const options = { 
	title: '', 
	headerStyle: { backgroundColor: colors.mainColor } ,
	headerTintColor: colors.whiteColor
};

const Routes = ({ currentUser, checkUserSession, isConnecting }) => {
	useEffect(() => {
		checkUserSession();
	}, []);
	return (
		<Fragment>
			{
				isConnecting && <Loader />
			}
			<NavigationContainer>
				<Stack.Navigator>
					<Stack.Screen
						name="Home"
						component={currentUser ? HomeScreen : WelcomeScreen}
						options={options}
					/>
					<Stack.Screen name="SignUp" options={options} component={SignUpScreen} />
					<Stack.Screen name="SignIn" options={options} component={SignInScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</Fragment>
	);
};

Routes.propTypes = {
	currentUser: PropTypes.any,
	checkUserSession: PropTypes.func,
	isConnecting: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
	currentUser: selectCurrentUser,
	isConnecting: selectConnectionStatus
});

const mapDispatchToProps = dispatch => ({
	checkUserSession: () => dispatch(checkUserSession()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Routes);