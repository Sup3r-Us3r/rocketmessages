import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import defaultChatBackground from '../../assets/defaultChatBackground.png';

export const Wrapper = styled.ImageBackground.attrs(() => ({
  source: defaultChatBackground,
}))`
  flex: 1;
  background: #fcfcfc;
`;

export const Container = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 1,
}))`
  flex: 1;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  height: 55px;
  background: #7159c1;
  padding: 0 10px;
`;

export const BackButton = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  padding: 10px;
`;

export const ChatImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin: 0 10px;
`;

export const ChatInfo = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex: 1;
`;

export const ChatName = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const ChatStatus = styled.Text`
  font-size: 15px;
  color: #fff;
  line-height: 20px;
`;

export const ChatAction = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  padding: 10px;
`;

export const MessageOptions = styled.View`
  z-index: 9999;
  position: absolute;
  padding: 10px;
  top: 1px;
  right: 1px;
  border-radius: 5px;
  background: #fff;
`;

// export const ArrowUpIcon = styled(Ionicons).attrs(() => ({
//   name: 'md-arrow-dropup',
//   color: '#fff',
//   size: 40,
// }))`
//   position: absolute;
//   top: 30px;
//   right: 20px;
//   align-self: flex-end;
// `;

export const shadowContainer = StyleSheet.create({
  shadowBox: {
    shadowColor: '#eee',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 15.0,
    elevation: 5,
  },
});

export const ClearMessages = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  padding: 8px 0;
`;

export const DeleteChat = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  padding: 8px 0;
`;

export const UpdateRoom = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  padding: 8px 0;
`;

export const ActionLabel = styled.Text`
  font-size: 16px;
  color: #7159c1;
  margin-left: 5px;
`;

export const ChatContainer = styled.ScrollView``;

export const ChatContainerMessageSent = styled.View`
  align-self: flex-end;
  margin-top: 5px;
  margin-left: 20%;
  margin-right: 2%;
  padding: 12px;
  background: #7159c1;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const MessageSentHour = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #bcbfc4;
`;

export const MessageSent = styled.Text`
  font-size: 16px;
  color: #fff;
`;

export const ChatContainerMessageReceived = styled.View`
  align-self: flex-start;
  margin-top: 5px;
  margin-right: 20%;
  margin-left: 2%;
  padding: 12px;
  background: #f8f8f7;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
  border-top-left-radius: 20px;
`;

export const MessageReceivedHour = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #bcbfc4;
`;

export const MessageReceived = styled.Text`
  font-size: 16px;
  color: #5f5c60;
`;

export const WrapperMessage = styled.View`
  padding: 5px 0px;
  background: transparent;
`;

export const MessageField = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const InputMessage = styled.TextInput`
  position: relative;
  flex: 1;
  background: #eee;
  border-radius: 20px;
  padding: 10px 20px 10px 40px;
  margin: 0 10px;
  font-size: 16px;
`;

export const SendMessage = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  background: #7159c1;
  padding: 12px;
  border-radius: 30px;
  margin-right: 10px;
`;

export const SelectEmoji = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.9,
}))`
  position: absolute;
  left: 0;
  bottom: 0;
  margin: 0 20px 11px 20px;
`;

export const AudioRecord = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.9,
}))`
  background: #7159c1;
  padding: 12px;
  border-radius: 30px;
  margin-right: 10px;
`;

export const EmojiContainer = styled.View`
  padding-top: 13px;
  height: 300px;
  margin-top: 15px;
`;

export const handleStyle = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export const overlayStyle = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(113, 89, 193, 0.3)',
  },
});
