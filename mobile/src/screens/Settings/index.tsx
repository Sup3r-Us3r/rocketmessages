import React, {useState, useEffect} from 'react';
import {Keyboard, Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

import Toast from '../../config/toastStyles';

import api from '../../services/api';

import {
  Wrapper,
  Container,
  Title,
  ContainerImage,
  UserImage,
  ContainerChangeImage,
  ChangeImage,
  ButtonApplySettings,
  ButtonLabel,
  UsernameInput,
  StatusMessage,
} from './styles';

interface IImagePickerResponse {
  didCancel: boolean;
  error: string;
  fileName?: string;
  fileSize: number;
  type?: string;
  uri: string;
  data: string;
  path?: string;
}

interface IImageProperties {
  fileName?: string;
  fileSize?: number;
  type?: string;
  uri?: string;
  data?: string;
  path?: string;
}

interface IUserData {
  id?: number;
  username?: string;
  email?: string;
  photo?: string;
  status?: string;
  created_at?: Date;
}

const Settings = () => {
  // States
  const [userData, setUserData] = useState<IUserData>({});
  const [selectedImage, setSelectedImage] = useState<IImageProperties>({});
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');

  function handleUploadImage(image: IImagePickerResponse) {
    if (image.error) {
      return;
    }

    if (image.didCancel) {
      return;
    }

    if (!image.uri) {
      return;
    }

    setSelectedImage({
      fileName: image.fileName,
      fileSize: image.fileSize,
      type: image.type,
      uri: image.uri,
      data: image.data,
      path: image.path,
    });
  }

  async function handleSaveChange() {
    try {
      const localData = {
        photo: selectedImage ? selectedImage?.uri : userData?.photo,
        username: usernameInput,
        status: statusInput,
      };

      await AsyncStorage.setItem(
        '@rocketMessages/userData',
        JSON.stringify(Object.assign(userData, localData)),
      );

      const formData = new FormData();

      formData.append('userphoto', {
        uri:
          Platform.OS === 'android'
            ? selectedImage?.uri
            : selectedImage?.uri?.replace('file://', ''),
        type: selectedImage?.type,
        name: selectedImage?.fileName,
        // data: selectedImage?.data,
      });
      formData.append('username', usernameInput);
      formData.append('status', statusInput);

      await api.put(`/updateuser/${userData?.id}`, formData, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });

      // const updateUser = await fetch('http://192.168.2.8:3333/updateuser/1', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      //   body: formData,
      // })
      //   .then((response) => {
      //     response.json();
      //   })
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((err) => console.log(err));

      // const updateUser = await api.put(
      //   `/updateuser/${userData?.id}`,
      //   formData,
      //   {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //   },
      // );

      // if (!updateUser) {
      //   return Toast.error('Erro ao atualizar informações.');
      // }

      // return Toast.success('Informações alteradas com sucesso.');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  function handleKeyboardUp() {}

  function handleKeyboardDown() {}

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardUp);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDown);

    return () => {
      Keyboard.removeListener('keyboardDidShow', handleKeyboardUp);
      Keyboard.removeListener('keyboardDidHide', handleKeyboardDown);
    };
  }, []);

  useEffect(() => {
    async function handleGetUserData() {
      const getMyData = await AsyncStorage.getItem('@rocketMessages/userData');

      const data = JSON.parse(String(getMyData));

      if (data) {
        setUserData(data);
      }

      setUsernameInput(data?.username);
      setStatusInput(data?.status);
    }

    handleGetUserData();
  }, []);

  return (
    <Wrapper>
      <Container>
        <Title>Configurações</Title>

        <ContainerImage>
          <UserImage source={{uri: userData?.photo}} />

          <ContainerChangeImage
            onPress={() =>
              ImagePicker.showImagePicker(
                {
                  title: 'Selecione uma imagem',
                  takePhotoButtonTitle: 'Tirar foto',
                  chooseFromLibraryButtonTitle: 'Escolher da galeria',
                  cancelButtonTitle: 'Cancelar',
                  storageOptions: {
                    skipBackup: true,
                    path: 'images',
                    cameraRoll: true,
                    waitUntilSaved: true,
                  },
                  // noData: true,
                  // storageOptions: {
                  //   skipBackup: true,
                  //   path: 'images',
                  // },
                },
                handleUploadImage,
              )
            }>
            <ChangeImage />
          </ContainerChangeImage>
        </ContainerImage>

        <UsernameInput
          onChangeText={setUsernameInput}
          autoCorrect={false}
          onSubmitEditing={Keyboard.dismiss}
          onBlur={Keyboard.dismiss}
          value={usernameInput}
        />
        <StatusMessage
          onChangeText={setStatusInput}
          autoCorrect={false}
          onSubmitEditing={Keyboard.dismiss}
          onBlur={Keyboard.dismiss}
          value={statusInput}
          maxLength={255}
        />
      </Container>

      <ButtonApplySettings onPress={handleSaveChange}>
        <ButtonLabel>Salvar alterações</ButtonLabel>
      </ButtonApplySettings>
    </Wrapper>
  );
};

export default Settings;
