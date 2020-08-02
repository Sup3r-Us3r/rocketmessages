import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  justify-content: center;
  align-items: center;
`;

export const ContainerPhoto = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  height: 300px;
  width: 300px;
  border-radius: 5px;
`;

export const Photo = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 300px;
  width: 300px;
  border-radius: 5px;
`;

export const shadowPhoto = StyleSheet.create({
  shadow: {
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: {width: 8, height: -8},
    shadowRadius: 13,
    shadowOpacity: 0.1,
    elevation: 5,
  },
});

export const Username = styled.Text`
  margin-top: 10px;
  font-size: 35px;
  font-weight: bold;
  color: #333;
`;

export const Status = styled.Text`
  color: #999;
  font-size: 20px;
`;

export const Email = styled.Text`
  color: #999;
  font-size: 18px;
`;
