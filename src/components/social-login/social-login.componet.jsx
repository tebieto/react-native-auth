import React from 'react';
import PropTypes from 'prop-types';
import GoogleIcon from '../../assets/google.png';
import FacebookIcon from '../../assets/facebook.png';
import { ImageContainer, SocialLoginContainer } from './social-login.styles';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { googleSignInStart } from '../../redux/user/user.action';

const SocialLogin = ({ googleSignInStart }) => {
	return (
		<SocialLoginContainer>
			<TouchableOpacity onPress={()=> googleSignInStart()} >
				<ImageContainer source={GoogleIcon} />
			</TouchableOpacity>
			<TouchableOpacity onPress={()=> alert('coming soon')}>
				<ImageContainer source={FacebookIcon} />
			</TouchableOpacity>
		</SocialLoginContainer>
	);
};

SocialLogin.propTypes = {
	googleSignInStart: PropTypes.func
};

const mapDispatchTopProps = dispatch => ({
	googleSignInStart: () => dispatch(googleSignInStart())
});

export default connect(null, mapDispatchTopProps)(SocialLogin);