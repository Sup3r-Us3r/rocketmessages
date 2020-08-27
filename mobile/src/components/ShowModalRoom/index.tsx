import React, {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import {Animated, Easing} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

// Import exported interface
import {ILatestMessageOfRoom} from '../../screens/Rooms';

import ImagePicker from 'react-native-image-picker';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

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

interface IShowModalRoomProps {
  toggleModalRoom: boolean;
  setToggleModalRoom: Dispatch<SetStateAction<boolean>>;
  whichModal: string;
  roomData?: ILatestMessageOfRoom;
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
  toggleModalRoom,
  setToggleModalRoom,
  whichModal,
  roomData,
}) => {
  // States
  const [userId, setUserId] = useState<number>();
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

  async function handleRequestCreateOrUpdateRoomApi(data: FormData) {
    try {
      const requestOptions = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      };

      const createOrUpdateResponse =
        whichModal === 'create'
          ? await api.post('/createroom', data, requestOptions)
          : await api.put(`/updateroom/${roomData?.id}`, data, requestOptions);

      if (!createOrUpdateResponse) {
        return Toast.error(
          whichModal === 'create'
            ? 'Erro ao criar grupo.'
            : 'Erro ao atualizar grupo.',
        );
      }

      const insertAdminInRoomResponse =
        whichModal === 'create' &&
        (await api.post('/insertuserinroom', {
          user_id: userId,
          nickname: nicknameInput,
          user_admin: true,
        }));

      if (whichModal === 'create' && !insertAdminInRoomResponse) {
        return Toast.error('Erro ao inserir usuário admin.');
      }

      const insertWelcomeMessageOnRoom =
        whichModal === 'create' &&
        (await api.post('/message', {
          bot: true,
          from: userId,
          to_room: Number(...createOrUpdateResponse.data),
          message: `Grupo ${nicknameInput} criado.`,
        }));

      if (whichModal === 'create' && !insertWelcomeMessageOnRoom) {
        return Toast.error('Erro ao inserir mensagem.');
      }

      return Toast.success(
        whichModal === 'create'
          ? 'Grupo criado com sucesso.'
          : 'Grupo atualizado com sucesso.',
      );
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

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
    const formData = new FormData();

    if (selectedImage?.fileName || selectedImage?.type) {
      formData.append('avatarphoto', {
        uri: selectedImage?.uri,
        name: selectedImage?.fileName,
        type: selectedImage?.type,
      });
    }
    formData.append('name', nameInput);
    formData.append('nickname', nicknameInput);

    return await handleRequestCreateOrUpdateRoomApi(formData);
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
      return setToggleModalRoom(false);
    }, 300);
  }

  useEffect(() => {
    if (roomData) {
      setSelectedImage({
        uri: roomData?.avatar,
      });
      setNameInput(roomData?.name);
      setNicknameInput(roomData?.nickname);
    }
  }, [roomData]);

  useEffect(() => {
    async function handleGetMyUserId() {
      try {
        const userData = await AsyncStorage.getItem('@rocketMessages/userData');

        const {id} = JSON.parse(String(userData));

        setUserId(Number(id));
      } catch (err) {
        return Toast.error('Erro ao obter dados locais.');
      }
    }

    handleGetMyUserId();
  }, []);

  useEffect(() => {
    if (toggleModalRoom) {
      memoizedCallback();
    }
  }, [toggleModalRoom, memoizedCallback]);

  return toggleModalRoom ? (
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
          <CreateRoomButton onPress={handleSubmit}>
            <CreateRoomLabel>
              {whichModal === 'create' ? 'Criar grupo' : 'Editar grupo'}
            </CreateRoomLabel>
          </CreateRoomButton>
        </Container>
      </ScrollView>
    </Wrapper>
  ) : null;
};

export default ShowModalRoom;
