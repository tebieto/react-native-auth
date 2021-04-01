import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../../components/custom-button/custom-button.component';
import CustomInput from '../../components/custom-input/custom-input.component';

import { H5Container, IntroContainer, SignupContainer, TextContainer } from './sign-up.styles';
import { selectCurrentUser, selectIsSubmittingRegister } from '../../redux/user/user.selector';
import { signUpStart } from '../../redux/user/user.action';
import { View } from 'react-native';
import { colors } from '../../../app.utils';
import SocialLogin from '../../components/social-login/social-login.componet';

const SignUpScreen = ({ signUpStart, isSubmittingForm, currentUser, navigation }) =>  {
	const defaultFormValues = { name: '', email: '', address: '', phone: '', password: '', confirm: '' };
	const [ userData, updateData ] = useState(defaultFormValues);
	const { name, email, password, confirm, address } = userData;
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

		if(!name) {
			hasError = true;
			errors['name'] = 'Name field is required';
		}

		if(!emailRegEx.test(email)) {
			hasError = true;
			errors['email'] = 'Invalid email address';
		}

		if(!email) {
			hasError = true;
			errors['email'] = 'Email field is required';
		}

		if(password !== confirm) {
			hasError = true;
			errors['confirm'] = 'Passwords does not match';
		}

		if(!password) {
			hasError = true;
			errors['password'] = 'Password field is required';
		}

		if(hasError) {
			return setFormErrors({ ...formErrors, ...errors });
		}

		await signUpStart({ full_name: name, email, password, address });
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
                    Create
				</H5Container>
				<H5Container>
                    an account
				</H5Container>
				<TextContainer marginTop="10px">
                    Fill the details and create your account
				</TextContainer>
			</IntroContainer>
			<SignupContainer>
				<CustomInput  errorText={formErrors.name} hasError={formErrors.name ? true : false} onChangeText={text => handleChange({ name: text })}
					value={name} autoCompleteType={'name'} placeholder={'Full Name'} />
				<CustomInput errorText={formErrors.email} hasError={formErrors.email? true : false} onChangeText={text => handleChange({ email: text })}
					value={email} autoCompleteType={'email'} placeholder={'Email'}  />
				<CustomInput errorText={formErrors.password} hasError={formErrors.password ? true : false} onChangeText={text => handleChange({ password: text })}
					value={password} placeholder={'Password'} forPassword={true} />
				<CustomInput errorText={formErrors.confirm} hasError={formErrors.confirm ? true : false} onChangeText={text => handleChange({ confirm: text })}
					value={confirm} placeholder={'Confirm Password'} forPassword={true} />
				<CustomButton loading={isSubmitting} onPress={handleSubmit}  uppercase={'true'} text="Continue" />
			</SignupContainer>
			<TextContainer marginTop="10px" textAlign="center">
                Or sign in with
			</TextContainer>
			<SocialLogin />
		</View>
	);
};

SignUpScreen.propTypes = {
	signUpStart: PropTypes.func,
	isSubmittingForm: PropTypes.bool,
	currentUser: PropTypes.any,
	navigation: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
	isSubmittingForm: selectIsSubmittingRegister,
	currentUser: selectCurrentUser
});

const mapDispatchTopProps = dispatch => ({
	signUpStart: userData => dispatch(signUpStart(userData))
});

export default connect(mapStateToProps, mapDispatchTopProps)(SignUpScreen);