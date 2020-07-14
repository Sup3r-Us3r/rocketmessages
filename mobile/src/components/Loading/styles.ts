import styled from 'styled-components/native';

export const Container = styled.View`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Logo = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  top: -100px;
  height: 530px;
  width: 530px;
`;

export const LoadingMessage = styled.Text`
  color: #7159c1;
  font-size: 33px;
  font-weight: bold;
`;

export const CreatedBy = styled.Text`
  color: #41414d;
  font-size: 16px;
  font-weight: bold;
`;
