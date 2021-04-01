import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { ButtonContainer, ButtonTextContainer, H5Container, WelcomeContainer } from './welcome.styles';

const WelcomeScreen = ({ navigation }) => {
	return (
		<WelcomeContainer>
			<H5Container>
				{'Welcome, its time. let\'s have a glimpse of the future.'}
			</H5Container>
			<View>
				<ButtonContainer>
					<ButtonTextContainer onPress={() =>
						navigation.navigate('SignIn')
					}>
						{'Login'}
					</ButtonTextContainer>
				</ButtonContainer>
				<ButtonContainer>
					<ButtonTextContainer onPress={() =>
						navigation.navigate('SignUp')
					}>
						{'Sign Up'}
					</ButtonTextContainer>
				</ButtonContainer>
			</View>
			<Text style={{ textAlign:'center', marginTop: 20 }}>
                &copy; {new Date().getFullYear()} Terry Ebieto
			</Text>
		</WelcomeContainer>
	);
};

WelcomeScreen.propTypes = {
	navigation: PropTypes.object.isRequired
};

export default WelcomeScreen;