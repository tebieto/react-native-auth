/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { ErrorTextContainer, InputViewContainer, TextInputContainer, Wrapper, } from './custom-input.styles';

const CustomInput = ({ handleChange, forPassword, errorText, ...otherProps }) => {

	return (
		<Wrapper style={{ width: '90%' }}>
			<InputViewContainer {...otherProps}>
				<TextInputContainer maxLength={50} secureTextEntry={forPassword ? true : false} onChange={handleChange} {...otherProps} autoCapitalize={'none'} />
			</InputViewContainer>
			{
				errorText ? <ErrorTextContainer>
					{errorText}
				</ErrorTextContainer>: null
			}
		</Wrapper>
	);
}; 

CustomInput.propTypes = {
	errorText: PropTypes.string,
	handleChange: PropTypes.func, 
	forPassword: PropTypes.bool, 
	hasError: PropTypes.bool,
};

export default React.memo(CustomInput);