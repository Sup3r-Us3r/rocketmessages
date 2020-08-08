import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {Animated, Easing} from 'react-native';
import {
  Wrapper,
  ScrollView,
  Container,
  ScreenBackContainer,
  ScreenBackIcon,
  AvatarContainer,
  Avatar,
  ChooseAvatar,
  ChooseAvatarIcon,
  Name,
  Nickname,
  CreateRoomButton,
  CreateRoomLabel,
} from './styles';
import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

interface IShowModalRoomProps {
  toggleModal: boolean;
  setToggleModal: Dispatch<SetStateAction<boolean>>;
}

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

const ShowModalRoom: React.FC<IShowModalRoomProps> = ({
  toggleModal,
  setToggleModal,
}) => {
  // States
  const [nameInput, setNameInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<IAvatarProperties>({});
  const [modalAnimation] = useState(new Animated.Value(0));

  // Callback
  const memoizedCallback = useCallback(() => {
    function handleModalAnimationFadeIn() {
      return Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }

    handleModalAnimationFadeIn();
  }, [modalAnimation]);

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

  function handleModalAnimationFadeOut() {
    return Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function handleScreenBack() {
    handleModalAnimationFadeOut();

    setTimeout(() => {
      return setToggleModal(false);
    }, 300);
  }

  useEffect(() => {
    if (toggleModal) {
      memoizedCallback();
    }
  }, [toggleModal, memoizedCallback]);

  return toggleModal ? (
    <Wrapper style={{opacity: modalAnimation}}>
      <ScrollView>
        <Container>
          <ScreenBackContainer onPress={handleScreenBack}>
            <ScreenBackIcon />
          </ScreenBackContainer>

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
        </Container>
      </ScrollView>
    </Wrapper>
  ) : null;
};

export default ShowModalRoom;
