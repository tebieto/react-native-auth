import styled from 'styled-components/native';

export const SignInContainer = styled.View`
    align-items: center;
    margin-bottom: 30px;
`;

export const H5Container = styled.Text`
    font-size: 30px;
    font-weight: bold;
    color: black;
`;

export const TextContainer = styled.Text`
    margin-top: ${({ marginTop }) => marginTop ? marginTop : 0};  
    text-align: ${({ textAlign }) => textAlign ? textAlign : 'left'} ; 
`;

export const IntroContainer = styled.View`
    margin: 70px 0;
    padding: 0 20px;
`;