import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View } from 'react-native';
import { signOutStart } from '../../redux/user/user.action';
import { ButtonContainer, ButtonTextContainer, H5Container, HomeContainer } from './home.styles';
import { createStructuredSelector } from 'reselect';
import { selectCurrentUser } from '../../redux/user/user.selector';

const HomeScreen = ({ signOutStart, currentUser }) => {
	return (
		<HomeContainer>
			<H5Container>
				Welcome home {currentUser && currentUser.full_name}.
                The future is ours.
			</H5Container>
			<View>
				<ButtonContainer>
					<ButtonTextContainer onPress={() =>
						signOutStart()
					}>
						{'Sign Out'}
					</ButtonTextContainer>
				</ButtonContainer>
			</View>
		</HomeContainer>
	);
};

HomeScreen.propTypes = {
	signOutStart: PropTypes.func,
	currentUser: PropTypes.object
};

const mapStateToProps = createStructuredSelector({
	currentUser: selectCurrentUser
});

const mapDispatchToProps = dispatch => ({
	signOutStart: () => dispatch(signOutStart())
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);