import styled from 'styled-components/native';

export const Wrapper = styled.View`
  flex: 1;
  background: #fff;
`;

export const ForgotPasswordContainer = styled.View`
  flex: 1;
  margin: 0 auto;
  align-items: center;
  width: 80%;
`;

export const ContainerAnimation = styled.View`
  height: 150px;
  width: 150px;
  margin: 0 auto;
`;

export const ForgotPasswordLabelBold = styled.Text`
  margin-top: 10px;
  font-size: 20px;
  text-align: center;
  font-weight: bold;
  color: #999;
`;

export const ForgotPasswordLabel = styled.Text`
  margin: 15px 0;
  font-size: 16px;
  text-align: center;
  color: #ddd;
`;

interface IEmailInputProps {
  loading: boolean;
}

export const EmailInput = styled.TextInput`
  font-size: 18px;
  color: ${({loading}: IEmailInputProps) => (loading ? '#999' : '#333')};
  padding: 20px 10px 10px 10px;
  border-bottom-width: 2px;
  border-bottom-color: ${({loading}: IEmailInputProps) =>
    loading ? '#999' : '#7159c1'};
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
