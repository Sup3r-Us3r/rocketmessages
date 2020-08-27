import styled from 'styled-components/native';

export const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: 16px;
  margin: 20px 0;
  color: #999;
  text-transform: uppercase;
`;

export const Container = styled.View`
  flex-direction: row;
  margin-bottom: 20px;
`;

export const ActionButtonContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  width: 45%;
  margin: 0 5px;
  background: #7159c1;
  padding: 10px;
  border-radius: 30px;
`;

export const ActionButtonLabel = styled.Text`
  font-size: 16px;
  color: #fff;
  text-align: center;
  font-weight: bold;
`;
