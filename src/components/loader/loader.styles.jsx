import styled from 'styled-components/native';
import { Dimensions } from 'react-native';

export const ViewContainer = styled.View`
 width: ${Dimensions.get('window').width}px;
 height: ${Dimensions.get('window').height}px;
 display: flex;
 align-items: center;
 justify-content: center;
`;