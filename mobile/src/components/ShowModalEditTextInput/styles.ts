import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';

export const Wrapper = styled.View`
  position: absolute;
  bottom: 0;
  height: 120px;
  width: 100%;
  background: #fff;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`;

export const shadowContainer = StyleSheet.create({
  shadowBox: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export const ModalActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

export const ModalButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  margin: 15px 20px 15px 0;
`;

export const ModalButtonLabel = styled.Text`
  font-size: 15px;
  font-weight: bold;
  text-transform: uppercase;
  color: #aaa;
`;
