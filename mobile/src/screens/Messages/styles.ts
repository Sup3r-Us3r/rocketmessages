import styled from 'styled-components/native';
import {StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export const CloseKeyboard = styled.TouchableWithoutFeedback``;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: #f3f8ff;
`;

export const Container = styled.View`
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

export const ContactImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 40px;
  width: 40px;
  border-radius: 20px;
  margin: 0 10px;
`;

export const ContactInfo = styled.View`
  flex: 1;
`;

export const ContactName = styled.Text`
  font-size: 16px;
  color: #fff;
  font-weight: bold;
`;

export const ContactStatus = styled.Text`
  font-size: 15px;
  color: #fff;
  line-height: 20px;
`;

export const ContactAction = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  padding: 10px;
`;

export const MessageOptions = styled.View`
  z-index: 9999;
  position: absolute;
  padding: 10px;
  width: 45%;
  top: 55px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background: #fff;
  margin-right: 20px;
  align-self: flex-end;
`;

export const ArrowUpIcon = styled(Ionicons).attrs(() => ({
  name: 'md-arrow-dropup',
  color: '#fff',
  size: 40,
}))`
  position: absolute;
  top: 30px;
  right: 20px;
  align-self: flex-end;
`;

export const shadowContainer = StyleSheet.create({
  shadowBox: {
    shadowColor: '#eee',
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
    elevation: 24,
  },
});

export const ClearMessages = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.6,
}))`
  flex-direction: row;
  padding: 8px 0;
`;

export const DeleteContact = styled.TouchableOpacity.attrs(() => ({
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

export const ChatContainer = styled.ScrollView`
  background: #f3f8ff;
`;

export const ChatContainerMessageSent = styled.View`
  align-self: flex-end;
  margin-top: 5px;
  margin-left: 20%;
  padding: 12px;
  background: #7159c1;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
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
  padding: 12px;
  background: #eee;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const MessageReceivedHour = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #bcbfc4;
`;

export const MessageReceived = styled.Text`
  font-size: 16px;
  color: #0a0a11;
`;

export const WrapperMessage = styled.View`
  padding: 13px 0;
  background: #fefffe;
`;

export const MessageField = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;

export const SelectEmoji = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.5,
}))`
  margin-right: 10px;
`;

export const InputMessage = styled.TextInput`
  flex: 1;
  background: #f3f4f6;
  border-radius: 50px;
  padding: 10px 20px;
  margin: 0 10px;
  font-size: 16px;
`;

export const AudioRecord = styled.View`
  margin-right: 10px;
`;

export const EmojiContainer = styled.View`
  padding-top: 13px;
  height: 300px;
  margin-top: 15px;
`;
