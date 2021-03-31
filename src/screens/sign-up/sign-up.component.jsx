import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import CustomButton from '../../components/custom-button/custom-button.component';
import CustomInput from '../../components/custom-input/custom-input.component';

import { SignupContainer } from './sign-up.styles';
import { selectIsSubmittingRegister } from '../../redux/user/user.selector';
import { signUpStart } from '../../redux/user/user.action';

const SignUpScreen = ({ signUpStart, isSubmittingForm }) =>  {
	const [ userData, updateData ] = useState({ name: '', email: '', address: '', phone: '', password: '', confirm: '' });
	const { name, email, password, confirm, address } = userData;
	const [isSubmitting, toggleSubmitting] = useState(false);

	useEffect(() => {
		toggleSubmitting(isSubmittingForm);
	}, [isSubmittingForm]);

	const handleSubmit = async () => {
		if (isSubmitting) return;
		await signUpStart({ full_name: name, email, password, address });
	};
  
	const handleChange = data => {
		const key = Object.keys(data)[0];
		const val = key == 'name' ? data[key] : data[key].trim();
		updateData({ ...userData, [key]: val });
	};

	return (
		<SignupContainer>
			<CustomInput onChangeText={text => handleChange({ name: text })}
				value={name} autoCompleteType={'name'} placeholder={'Full Name'} />
			<CustomInput onChangeText={text => handleChange({ email: text })}
				value={email} autoCompleteType={'email'} placeholder={'Email'}  />
			<CustomInput hasError  onChangeText={text => handleChange({ password: text })}
				value={password} placeholder={'Password'} forPassword={true} />
			<CustomInput onChangeText={text => handleChange({ confirm: text })}
				value={confirm} placeholder={'Confirm Password'} forPassword={true} />
			<CustomButton loading={isSubmittingForm} onPress={handleSubmit}  uppercase={'true'} text="Continue" />
		</SignupContainer>
	);
};

SignUpScreen.propTypes = {
	signUpStart: PropTypes.func,
	isSubmittingForm: PropTypes.bool
};

const mapStateToProps = createStructuredSelector({
	isSubmittingForm: selectIsSubmittingRegister
});

const mapDispatchTopProps = dispatch => ({
	signUpStart: userData => dispatch(signUpStart(userData))
});

export default connect(mapStateToProps, mapDispatchTopProps)(SignUpScreen);