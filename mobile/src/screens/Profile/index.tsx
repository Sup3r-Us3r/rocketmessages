import React, {useState, useEffect, useContext} from 'react';
import {Keyboard, Platform} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';

import AuthContex from '../../contexts/auth';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  Header,
  Title,
  LogoutContainer,
  Container,
  ContainerImage,
  ChangeImageButton,
  ChangeImageIcon,
  WrapperText,
  ContainerUsernameField,
  UsernameLabel,
  ContainerStatusMessageField,
  StatusMessageLabel,
  TextInfoGroup,
  IndicatorLabel,
  UsernameInput,
  StatusMessageInput,
  ShowModalEditTextInput,
  shadowContainer,
  ModalActions,
  ModalButton,
  ModalButtonLabel,
} from './styles';

interface IImagePickerResponse {
  didCancel: boolean;
  error: string;
  fileName?: string;
  fileSize: number;
  type?: string;
  uri: string;
}

interface IImageProperties {
  uri?: string;
  fileName?: string;
  type?: string;
}

interface IUserData {
  id: number;
  username: string;
  email: string;
  photo: string;
  status: string;
  created_at: Date;
}

const Profile: React.FC = () => {
  // Context
  const {userData, signOut} = useContext(AuthContex);

  // States
  const [selectedImage, setSelectedImage] = useState<IImageProperties>({});
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');
  const [oldValueUsernameInput, setOldValueUsernameInput] = useState<string>(
    '',
  );
  const [oldValueStatusInput, setOldValueStatusInput] = useState<string>('');
  const [toggleModal, setToggleModal] = useState<boolean>(false);
  const [showModalOf, setShowModalOf] = useState<string>('');

  async function handleRequestUpdateUserApi(updateData: FormData) {
    try {
      const response = await api.put(
        `/updateuser/${userData?.id}`,
        updateData,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (!response) {
        return Toast.error('Erro ao atualizar informação.');
      }

      return Toast.success('Informação alterada com sucesso.');
    } catch (err) {
      const error = err.response.data;

      return Toast.error(error);
    }
  }

  async function handleUploadImage(image: IImagePickerResponse) {
    if (image?.error) {
      return;
    }

    if (image?.didCancel) {
      return;
    }

    if (!image?.uri) {
      return;
    }

    setSelectedImage({
      uri: image?.uri,
    });

    const formData = new FormData();

    formData.append('userphoto', {
      uri:
        Platform.OS === 'android'
          ? image?.uri
          : image?.uri?.replace('file://', ''),
      name: image?.fileName,
      type: image?.type,
    });

    await handleRequestUpdateUserApi(formData);

    return await handleSaveLocalStorageChange();
  }

  async function handleUpdateUsername() {
    setOldValueUsernameInput(usernameInput);

    const formData = new FormData();

    formData.append('username', usernameInput);

    await handleRequestUpdateUserApi(formData);
    await handleSaveLocalStorageChange();

    return setToggleModal(false);
  }

  async function handleUpdateStatus() {
    setOldValueStatusInput(statusInput);

    const formData = new FormData();

    formData.append('status', statusInput);

    await handleRequestUpdateUserApi(formData);
    await handleSaveLocalStorageChange();

    return setToggleModal(false);
  }

  async function handleSaveLocalStorageChange() {
    const localData = {
      photo: selectedImage?.uri,
      username: usernameInput ? usernameInput : oldValueUsernameInput,
      status: statusInput ? statusInput : oldValueStatusInput,
    };

    await AsyncStorage.setItem(
      '@rocketMessages/userData',
      JSON.stringify(Object.assign(userData, localData)),
    );
  }

  function handleShowModalEditUsername() {
    setUsernameInput(oldValueUsernameInput);
    setShowModalOf('username');

    return setToggleModal(true);
  }

  function handleShowModalEditStatus() {
    setStatusInput(oldValueStatusInput);
    setShowModalOf('status');

    return setToggleModal(true);
  }

  function handleCloseModal() {
    return setToggleModal(false);
  }

  function handleLimitStatusCharacters(text: string) {
    return text.length >= 35 ? text.substr(0, 35) + '...' : text;
  }

  function handleSignOut() {
    return signOut();
  }

  useEffect(() => {
    async function handleGetUserData() {
      try {
        const user = await api.get<IUserData>(`/user/${userData?.id}`);

        if (!user) {
          return Toast.error('Erro ao obter informações.');
        }

        setSelectedImage({
          uri: user?.data?.photo,
        });
        setOldValueUsernameInput(user?.data?.username);
        setOldValueStatusInput(user?.data?.status);
      } catch (err) {
        const error = err.response.data;

        return Toast.error(error);
      }
    }

    handleGetUserData();
  }, [userData]);

  return (
    <Wrapper>
      <Header>
        <Title>Edite suas informações</Title>

        <LogoutContainer onPress={handleSignOut}>
          <AntDesign name="logout" color="#7159c1" size={20} />
        </LogoutContainer>
      </Header>

      <ContainerImage source={{uri: selectedImage?.uri}}>
        <ChangeImageButton
          onPress={() =>
            ImagePicker.showImagePicker(
              {
                title: 'Selecione uma imagem',
                takePhotoButtonTitle: 'Tirar foto',
                chooseFromLibraryButtonTitle: 'Escolher da galeria',
                cancelButtonTitle: 'Cancelar',
                // noData: true,
                storageOptions: {
                  // skipBackup: true,
                  path: 'images',
                  cameraRoll: true,
                  waitUntilSaved: true,
                },
              },
              handleUploadImage,
            )
          }>
          <ChangeImageIcon />
        </ChangeImageButton>
      </ContainerImage>

      <Container>
        <WrapperText>
          <ContainerUsernameField onPress={handleShowModalEditUsername}>
            <AntDesign name="user" color="#7159c1" size={18} />
            <TextInfoGroup>
              <IndicatorLabel>Nome</IndicatorLabel>
              <UsernameLabel>{oldValueUsernameInput}</UsernameLabel>
            </TextInfoGroup>
          </ContainerUsernameField>

          <ContainerStatusMessageField onPress={handleShowModalEditStatus}>
            <AntDesign name="infocirlceo" color="#7159c1" size={18} />
            <TextInfoGroup>
              <IndicatorLabel>Recado</IndicatorLabel>
              <StatusMessageLabel>
                {handleLimitStatusCharacters(oldValueStatusInput)}
              </StatusMessageLabel>
            </TextInfoGroup>
          </ContainerStatusMessageField>
        </WrapperText>
      </Container>

      {toggleModal && (
        <ShowModalEditTextInput style={shadowContainer.shadowBox}>
          {showModalOf === 'username' && (
            <UsernameInput
              autoFocus
              placeholder="Digite seu nome"
              onChangeText={setUsernameInput}
              autoCorrect={false}
              onSubmitEditing={Keyboard.dismiss}
              onBlur={Keyboard.dismiss}
              value={usernameInput}
            />
          )}

          {showModalOf === 'status' && (
            <StatusMessageInput
              autoFocus
              placeholder="Digite seu status"
              onChangeText={setStatusInput}
              autoCorrect={false}
              onSubmitEditing={Keyboard.dismiss}
              onBlur={Keyboard.dismiss}
              value={statusInput}
            />
          )}

          <ModalActions>
            <ModalButton onPress={handleCloseModal}>
              <ModalButtonLabel>Cancelar</ModalButtonLabel>
            </ModalButton>

            <ModalButton
              onPress={
                showModalOf === 'username'
                  ? handleUpdateUsername
                  : handleUpdateStatus
              }>
              <ModalButtonLabel>Salvar</ModalButtonLabel>
            </ModalButton>
          </ModalActions>
        </ShowModalEditTextInput>
      )}
    </Wrapper>
  );
};

export default Profile;
