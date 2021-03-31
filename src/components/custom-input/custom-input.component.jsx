/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';

import { ErrorTextContainer, InputViewContainer, TextInputContainer, } from './custom-input.styles';

const CustomInput = ({ handleChange, forPassword, errorText, ...otherProps }) => {

	return (
		<View style={{ width: '90%' }}>
			<InputViewContainer {...otherProps}>
				<TextInputContainer maxLength={50} secureTextEntry={forPassword ? true : false} onChange={handleChange} {...otherProps} autoCapitalize={'none'} />
			</InputViewContainer>
			{
				errorText ? <ErrorTextContainer>
					{errorText}
				</ErrorTextContainer>: null
			}
		</View>
	);
}; 

CustomInput.propTypes = {
	errorText: PropTypes.string,
	handleChange: PropTypes.func, 
	forPassword: PropTypes.bool, 
	hasError: PropTypes.bool,
};

export default React.memo(CustomInput);