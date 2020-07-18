import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ImagePicker from 'react-native-image-picker';

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
  NameInput,
  StatusMessage,
} from './styles';

interface IImagePickerResponse {
  didCancel: boolean;
  error: string;
  uri: string;
  fileSize: number;
  fileName?: string;
}

const Settings = () => {
  // States
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [nameInput, setNameInput] = useState<string>('Sup3r Us3r');
  const [statusInput, setStatusInput] = useState<string>(
    'VOU INVADIR SEU CORAÇÃO, FORMATAR TODO RANCOR, INSTALAR MINHA PAIXÃO ESOLTAR O WORM DO AMOR ❤',
  );
  const [buttonHide, setButtonHide] = useState<boolean>(false);

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

  function handleSaveChange() {
    const data = {
      name: nameInput,
      status: statusInput,
    };

    console.log(data);
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

  return (
    <Wrapper>
      <Container>
        <Title>Configurações</Title>
        <ContainerImage>
          <UserImage
            source={{
              uri: selectedImage ? selectedImage : 'https://bit.ly/2AnqPdA',
            }}
          />
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
        <NameInput
          value={nameInput}
          onChangeText={setNameInput}
          autoCorrect={false}
          onSubmitEditing={Keyboard.dismiss}
          onBlur={Keyboard.dismiss}
        />
        <StatusMessage
          value={statusInput}
          onChangeText={setStatusInput}
          autoCorrect={false}
          onSubmitEditing={Keyboard.dismiss}
          onBlur={Keyboard.dismiss}
        />
      </Container>
      <ButtonApplySettings onPress={handleSaveChange}>
        <AntDesign name="save" color="#fff" size={20} />
        <ButtonLabel>Salvar alterações</ButtonLabel>
      </ButtonApplySettings>
    </Wrapper>
  );
};

export default Settings;
