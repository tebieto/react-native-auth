/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { ButtonTextContainer, CustomButtonContainer } from './custom-button.styles';

const CustomButton = ({ text, loading, ...otherProps }) => (
	<CustomButtonContainer {...otherProps}>
		<ButtonTextContainer>{loading ? 'Connecting...' : text}</ButtonTextContainer>
	</CustomButtonContainer>
);

CustomButton.propTypes = {
	text: PropTypes.string,
	handlePress: PropTypes.func,
	loading: PropTypes.bool
};

export default React.memo(CustomButton);