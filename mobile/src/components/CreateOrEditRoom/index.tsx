import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react';
import {Animated, Easing} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// Import exported interface
import {ILatestMessageOfRoom} from '../../screens/Rooms';

import ImagePicker from 'react-native-image-picker';

import AuthContext from '../../contexts/auth';

import socket from '../../services/websocket';
import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  ScrollView,
  Container,
  ScreenBackContainer,
  ScreenBackIcon,
  AvatarContainer,
  DefaultAvatar,
  Avatar,
  ChooseAvatar,
  ChooseAvatarIcon,
  Name,
  Nickname,
  CreateRoomButton,
  CreateRoomLabel,
} from './styles';

export interface ICreateOrEditRoomHandles {
  openModal: () => void;
}

interface ICreateOrEditRoomProps {
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

interface IRoomInputs {
  name: string;
  nickname: string;
}

const CreateOrEditRoom: React.ForwardRefRenderFunction<
  ICreateOrEditRoomHandles,
  ICreateOrEditRoomProps
> = ({whichModal, roomData}, ref) => {
  // Context
  const {userData} = useContext(AuthContext);

  // State
  const [visible, setVisible] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>('');
  const [nicknameInput, setNicknameInput] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<IAvatarProperties>({});
  const [modalAnimation] = useState(new Animated.Value(0));

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  // ImperativeHandle
  useImperativeHandle(ref, () => {
    return {
      openModal,
    };
  });

  const animationFadeIn = useCallback(() => {
    function handleModalAnimationFadeIn() {
      return Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 100,
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
          user_id: userData?.id,
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
          from: userData?.id,
          to_room: Number(...createOrUpdateResponse.data),
          message: `Grupo ${nicknameInput} criado`,
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

  function handleFieldsValidation(fields: IRoomInputs): boolean {
    if (!fields.name || !fields.nickname) {
      Toast.error('Campos obrigatórios.');

      return false;
    }

    return true;
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

    const validation = handleFieldsValidation({
      name: nameInput,
      nickname: nicknameInput,
    });

    if (validation) {
      await handleRequestCreateOrUpdateRoomApi(formData);

      setVisible(false);
      setNameInput('');
      setNicknameInput('');

      return socket.emit('myRoomsRefresh', true);
    }
  }

  function handleModalAnimationFadeOut() {
    return Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 100,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }

  function handleScreenBack() {
    handleModalAnimationFadeOut();

    setTimeout(() => {
      return setVisible(false);
    }, 100);
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
    if (visible) {
      animationFadeIn();
    }
  }, [visible, animationFadeIn]);

  return visible ? (
    <Wrapper style={{opacity: modalAnimation}}>
      <ScrollView>
        <Container>
          <ScreenBackContainer onPress={handleScreenBack}>
            <ScreenBackIcon />
          </ScreenBackContainer>

          <AvatarContainer>
            {whichModal === 'create' && !selectedImage?.uri ? (
              <DefaultAvatar>
                <MaterialCommunityIcons
                  name="image-search-outline"
                  size={100}
                  color="#fff"
                />
              </DefaultAvatar>
            ) : (
              <Avatar source={{uri: selectedImage?.uri}} />
            )}
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
            autoCapitalize="none"
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

export default forwardRef(CreateOrEditRoom);
