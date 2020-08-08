import React, {useState} from 'react';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  ScrollView,
  Title,
  AvatarContainer,
  Avatar,
  ChooseAvatar,
  ChooseAvatarIcon,
  Name,
  Nickname,
  CreateRoomButton,
  CreateRoomLabel,
} from './styles';

interface IImagePickerResponse {
  didCancel: boolean;
  error: string;
  uri: string;
  fileSize: number;
  type?: string;
  fileName?: string;
}

interface IAvatarProperties {
  uri?: string;
  fileName?: string;
  type?: string;
}

const CreateRoom: React.FC = ({}) => {
  // States
  const [nameInput, setNameInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<IAvatarProperties>({});

  async function handleSelectAvatar(avatar: IImagePickerResponse) {
    if (avatar?.error) {
      return;
    }

    if (avatar?.didCancel) {
      return;
    }

    if (!avatar?.uri) {
      return;
    }

    setSelectedImage({
      uri: avatar?.uri,
      fileName: avatar?.fileName,
      type: avatar?.type,
    });
  }

  async function handleSubmit() {
    try {
      const formData = new FormData();

      formData.append('avatarphoto', {
        uri: selectedImage?.uri,
        name: selectedImage?.fileName,
        type: selectedImage?.type,
      });
      formData.append('name', nameInput);
      formData.append('nickname', nicknameInput);

      const response = await api.post('createroom', formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response) {
        return Toast.error('Erro ao criar grupo.');
      }
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  return (
    <Wrapper>
      <Title>Criar grupo</Title>
      <AvatarContainer>
        <Avatar
          source={{uri: selectedImage?.uri || 'https://bit.ly/3fqFao7'}}
        />
        <ChooseAvatar
          onPress={() =>
            ImagePicker.launchImageLibrary(
              {
                // noData: true,
                storageOptions: {
                  cameraRoll: true,
                  path: 'images',
                  waitUntilSaved: true,
                },
              },
              handleSelectAvatar,
            )
          }>
          <ChooseAvatarIcon />
        </ChooseAvatar>
      </AvatarContainer>
      <Name
        placeholder="Nome do grupo"
        autoCorrect={false}
        onChangeText={setNameInput}
        value={nameInput}
      />
      <Nickname
        placeholder="Nome de identificação do grupo"
        autoCorrect={false}
        onChangeText={setNicknameInput}
        value={nicknameInput}
      />
      <CreateRoomButton>
        <CreateRoomLabel>Criar grupo</CreateRoomLabel>
      </CreateRoomButton>
    </Wrapper>
  );
};

export default CreateRoom;
