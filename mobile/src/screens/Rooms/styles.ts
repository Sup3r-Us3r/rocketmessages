import styled, {css} from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: #fff;
`;

export const NoMessage = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const NoMessageBackground = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 200px;
  width: 200px;
`;

export const NoMessageLabel = styled.Text`
  font-size: 18px;
  text-align: center;
  color: #ddd;
`;

export const Container = styled.View`
  margin-top: 20px;
  padding: 0 10px;
`;

export const Title = styled.Text`
  font-size: 27px;
  font-weight: bold;
  color: #7159c1;
  margin-bottom: 20px;
`;

export const ListRooms = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
}))`
  margin-bottom: 50px;
`;

export const RoomContainer = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  border-radius: 7px;
`;

export const RoomImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export const RoomInfoData = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const RoomInfo = styled.View``;

export const RoomNotificationMessage = styled.View``;

export const RoomName = styled.Text`
  font-size: 16px;
  color: #a9b3a9;
  font-weight: bold;
`;

export const RoomLastMessage = styled.Text`
  font-size: 15px;
  color: #0a0a11;
`;

export const RoomMessageDate = styled.Text`
  align-self: flex-end;
  font-size: 14px;
  font-weight: bold;
  color: #0a0a11;
`;

interface ITotalMessageProp {
  totalMessage: number;
}

export const RoomTotalMessages = styled.Text`
  align-self: flex-end;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  padding: 4px 5px;
  text-align: center;
  border-radius: 50px;
  background: #7159c1;

  ${({totalMessage}: ITotalMessageProp) =>
    totalMessage <= 9 &&
    css`
      height: 27px;
      width: 27px;
    `}
`;

export const ContainerCreateRoom = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))`
  position: absolute;
  bottom: 20px;
  right: 10px;
  align-items: center;
  justify-content: center;
  background: #7159c1;
  height: 50px;
  width: 50px;
  border-radius: 25px;
`;
