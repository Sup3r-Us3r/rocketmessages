import styled from 'styled-components/native';

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background: #fff;
`;

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  margin: 10px;
`;

export const SearchInput = styled.TextInput`
  font-size: 16px;
  background: #f3f8ff;
  color: #111;
  position: relative;
  padding: 10px 20px;
  border-radius: 50px;
`;

export const SearchIcon = styled.TouchableOpacity.attrs(() => ({
  opacityActivity: 0.5,
}))`
  position: absolute;
  top: 0;
  right: 0;
  margin: 6px 6px 0 0;
  padding: 8px;
`;

export const ContactsFound = styled.ScrollView.attrs(() => ({
  showsVerticalScrollIndicator: false,
}))``;

export const ContactInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;
  padding: 0 20px;
`;

export const ContactContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContactImage = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 50px;
  width: 50px;
  border-radius: 25px;
  margin-right: 10px;
`;

export const ContactLabels = styled.View`
  align-items: flex-start;
`;

export const ContactName = styled.Text`
  color: #a9b3a9;
  font-size: 16px;
  font-weight: bold;
`;

export const ContactLogin = styled.Text`
  color: #0a0a11;
  font-size: 15px;
  font-weight: bold;
`;

export const ContactAction = styled.TouchableOpacity.attrs(() => ({
  activeOpacity: 0.8,
}))``;

export const NoResearch = styled.View`
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const NoResearchBackground = styled.Image.attrs(() => ({
  resizeMode: 'cover',
}))`
  height: 250px;
  width: 300px;
`;

export const NoResearchLabel = styled.Text`
  margin-top: 15px;
  font-size: 18px;
  color: #ddd;
  text-align: center;
`;
