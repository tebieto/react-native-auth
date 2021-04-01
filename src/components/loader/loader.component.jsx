import React from 'react';
import { ActivityIndicator } from 'react-native';
import { ViewContainer } from './loader.styles';

const Loader = ()=> (
	<ViewContainer>
		<ActivityIndicator size="large" color="purple" />
	</ViewContainer>
);

export default Loader;
