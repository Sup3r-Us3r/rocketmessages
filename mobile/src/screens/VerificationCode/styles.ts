import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';

export const Wrapper = styled.View`
  flex: 1;
  background: #fff;
`;

export const Container = styled.View`
  flex: 1;
  margin: 0 auto;
  align-items: center;
  width: 80%;
`;

export const ContainerAnimation = styled.View`
  height: 180px;
  width: 180px;
  margin: 0 auto;
`;

export const VerificationCodeLabel = styled.Text`
  margin: 10px 0;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #999;
`;

export const NewPasswordLabel = styled.Text`
  margin-top: 10px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #999;
`;

export const NewPasswordInput = styled.TextInput`
  font-size: 18px;
  color: #333;
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: #7159c1;
  border-radius: 8px;
  width: 100%;
`;

export const SendRequest = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  margin-top: 20px;
  width: 100%;
  background: #7159c1;
  padding: 17px 20px;
  border-radius: 5px;
`;

export const SendRequestLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: #fff;
`;

export const codeInputStyles = StyleSheet.create({
  input: {
    borderWidth: 2,
    color: '#7159c1',
  },
});
