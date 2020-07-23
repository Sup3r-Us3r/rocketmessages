import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
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
  uri: string;
  fileSize: number;
  fileName?: string;
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
  const [selectedImage, setSelectedImage] = useState<string>('');
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

    setSelectedImage(image.uri);
  }

  async function handleSaveChange() {
    try {
      const dataa = {
        photo: selectedImage ? selectedImage : userData?.photo,
        username: usernameInput,
        status: statusInput,
      };

      console.log('DADOS: ', dataa);

      await AsyncStorage.clear();

      await AsyncStorage.setItem(
        '@rocketMessages/userData',
        JSON.stringify({
          ...userData,
          ...dataa,
        }),
      ).then((dados) => {
        console.log(dados);
      });

      const getMyData = await AsyncStorage.getItem('@rocketMessages/userData');

      const {data} = JSON.parse(String(getMyData));

      console.log('LOCAL: ', data);

      // const updateUser = await api.put(`/updateuser/${userData.id}`, data);

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

      const {data} = JSON.parse(String(getMyData));

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
