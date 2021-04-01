import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../../components/custom-button/custom-button.component';
import CustomInput from '../../components/custom-input/custom-input.component';
import { SignInContainer, IntroContainer, H5Container, TextContainer } from './sign-in.styles';
import { useState } from 'react';
import { useEffect } from 'react';
import { selectCurrentUser, selectIsSubmittingLogin } from '../../redux/user/user.selector';
import { emailSignInStart } from '../../redux/user/user.action';
import { View } from 'react-native';
import { colors } from '../../../app.utils';
import SocialLogin from '../../components/social-login/social-login.componet';

const SignInScreen = ({ emailSignInStart, isSubmittingForm, currentUser, navigation }) => {
	const defaultFormValues = { email: '', password: '' };
	const [ userData, updateData ] = useState(defaultFormValues);
	const { email, password } = userData;
	const [isSubmitting, toggleSubmitting] = useState(false);
	const [formErrors, setFormErrors] = useState(defaultFormValues);

	useEffect(() => {
		toggleSubmitting(isSubmittingForm);
	}, [isSubmittingForm]);

	useEffect(() => {
		if(currentUser) {
			navigation.navigate('Home');
		}
	},[currentUser]);

	const emailRegEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const handleSubmit = async () => {
		if (isSubmitting) return;
		const errors = {};
		let hasError;

		if(!emailRegEx.test(email)) {
			hasError = true;
			errors['email'] = 'Invalid email address';
		}

		if(!email) {
			hasError = true;
			errors['email'] = 'Email field is required';
		}

		if(!password) {
			hasError = true;
			errors['password'] = 'Password field is required';
		}

		if(hasError) {
			return setFormErrors({ ...formErrors, ...errors });
		}

		await emailSignInStart({ email, password });
	};
  
	const handleChange = data => {
		const key = Object.keys(data)[0];
		setFormErrors({ ...formErrors, [key]: '' });
		const val = key == 'name' ? data[key] : data[key].trim();
		updateData({ ...userData, [key]: val });
	};
	return (
		<View style={{ width: '100%', height: '100%', backgroundColor: colors.whiteColor }}>
			<IntroContainer>
				<H5Container>
                    Sign In
				</H5Container>
				<TextContainer marginTop="10px">
                    Fill the details to continue
				</TextContainer>
			</IntroContainer>
			<SignInContainer>
				<CustomInput errorText={formErrors.email} hasError={formErrors.email? true : false} onChangeText={text => handleChange({ email: text })}
					value={email} autoCompleteType={'email'} placeholder={'Email'}  />
				<CustomInput errorText={formErrors.password} hasError={formErrors.password ? true : false} onChangeText={text => handleChange({ password: text })}
					value={password} placeholder={'Password'} forPassword={true} />
				<CustomButton loading={isSubmitting} onPress={handleSubmit}  uppercase={'true'} text="Sign In" />
			</SignInContainer>
			<TextContainer marginTop="10px" textAlign="center">
                Or sign in with
			</TextContainer>
			<SocialLogin />
		</View>
	);
};

SignInScreen.propTypes = {
	emailSignInStart: PropTypes.func,
	isSubmittingForm: PropTypes.bool,
	currentUser: PropTypes.any,
	navigation: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
	isSubmittingForm: selectIsSubmittingLogin,
	currentUser: selectCurrentUser
});

const mapDispatchTopProps = dispatch => ({
	emailSignInStart: userData => dispatch(emailSignInStart(userData))
});

export default connect(mapStateToProps, mapDispatchTopProps)(SignInScreen);