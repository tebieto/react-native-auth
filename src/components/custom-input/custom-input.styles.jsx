import styled from 'styled-components/native';

export const InputViewContainer = styled.View`
    width: 100%;
    border: ${({ hasError }) => hasError ? '1px solid red' : '1px solid purple'};
    border-radius: 25px;
`;

export const TextInputContainer = styled.TextInput` 
    width: 100%;
    padding: 10px;
    border-radius: ${({ radius }) => radius ? radius : 0};
    color: ${({ txtcolor }) => txtcolor ? txtcolor : '#000'};
    padding-left:25px;
    background-color: transparent;
`;

export const ErrorTextContainer = styled.Text`
    color: red;
    font-size: 10px;
    padding-left: 25px;
    padding-top: 5px;
`;

export const Wrapper = styled.View`
    margin-bottom: 20px;
`;
