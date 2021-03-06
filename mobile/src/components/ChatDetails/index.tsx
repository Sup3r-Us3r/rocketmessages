import React, {useState, useEffect, useContext} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {updateParticipantsInRoomRequest} from '../../store/modules/refreshRoom/actions';

// import exported interface
import {ILatestMessageOfContact} from '../../screens/Chat';
import {ILatestMessageOfRoom} from '../../screens/Rooms';

import AuthContext from '../../contexts/auth';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  ContainerImage,
  Photo,
  shadowPhoto,
  ChatTitle,
  ChatSubtitle,
  ChatInfo,
  ParticipantsContainer,
  ParticipantsTitle,
  ParticipantInfo,
  ParticipantPhotoContainer,
  ParticipantAdminIcon,
  ParticipantPhoto,
  ParticipantGroupLabel,
  ParticipantName,
  ParticipantStatus,
  ParticipantActionsContainer,
  ParticipantActionMakeOrUnmakeAdmin,
  ParticipantActionMakeOrUnmakeAdminIcon,
  ParticipantActionRemove,
  ParticipantActionRemoveIcon,
} from './styles';

interface IDataReceivedFromNavigation {
  contactData?: ILatestMessageOfContact;
  roomData?: ILatestMessageOfRoom;
}

interface IChatDetailsProps {
  chatData: IDataReceivedFromNavigation;
}

interface IParticipants {
  id: number;
  user_admin: boolean;
  username: string;
  status: string;
  photo: string;
}

const ChatDetails: React.FC<IChatDetailsProps> = ({chatData}) => {
  // Redux
  const dispatch = useDispatch();
  const updateParticipant = useSelector(
    (state: any) => state.refreshRoom.updateParticipant,
  );

  // Context
  const {userData} = useContext(AuthContext);

  // States
  const [participants, setParticipants] = useState<IParticipants[]>([]);
  const [admin, setAdmin] = useState<boolean>(false);

  function handleLimitCharacters(text: string) {
    return text.length >= 30 ? text.substr(0, 30) + '...' : text;
  }

  async function handleMakeOrUnmakeUserAdmin(userId: number) {
    try {
      const imAdmin = Boolean(
        participants.find((user: IParticipants) => user.id === userId)
          ?.user_admin,
      );

      const response = await api.put(
        `/makeorunmakeuseradmin/${userId}/${chatData?.roomData?.id}`,
        {
          user_admin: !imAdmin,
        },
      );

      if (!response) {
        return Toast.error('Erro ao tornar usuário admin.');
      }

      const whoIs = participants.find((user) => user.id === userId)?.username;

      Toast.success(
        !imAdmin
          ? `${whoIs} é um administrador.`
          : `${whoIs} não é um administrador.`,
      );

      return dispatch(
        updateParticipantsInRoomRequest(`${whoIs}-${Math.random()}`),
      );
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  async function handleRemoveUserFromRoom(userId: number) {
    try {
      const response = await api.delete(
        `/deleteuserfromroom/${userId}/${chatData?.roomData?.id}`,
      );

      if (!response) {
        return Toast.error('Erro ao remover usuário do grupo.');
      }

      const userRemoved = participants.find(
        (user: IParticipants) => user.id === userId,
      )?.username;

      const sendMessageUserRemoved = await api.post('/message', {
        bot: true,
        from: userId,
        to_room: chatData?.roomData?.id,
        to_user: null,
        message: `${userRemoved} foi removido do grupo`,
      });

      if (!sendMessageUserRemoved) {
        return Toast.error('Erro ao enviar mensagem de usuário removido.');
      }

      Toast.success(`${userRemoved} removido com sucesso.`);

      return dispatch(
        updateParticipantsInRoomRequest(`${userRemoved}-${Math.random()}`),
      );
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  useEffect(() => {
    async function handleGetParticipants() {
      try {
        const users = await api.get<IParticipants[]>('/usersinroom', {
          params: {
            nickname: chatData?.roomData?.nickname,
            user_id: userData?.id,
          },
        });

        if (!users) {
          return Toast.error('Erro ao listar participantes.');
        }

        // I'm admin?
        const isAdmin = Boolean(
          users.data.find((user) => user?.id === userData?.id)?.user_admin,
        );

        if (isAdmin) {
          setAdmin(true);
        }

        return setParticipants(users.data);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    if (chatData?.roomData?.nickname) {
      handleGetParticipants();
    }
  }, [chatData, userData, updateParticipant]);

  return (
    <Wrapper>
      <ContainerImage style={shadowPhoto.shadow}>
        <Photo
          source={{
            uri: chatData?.contactData
              ? chatData?.contactData?.photo
              : chatData?.roomData?.avatar,
          }}
        />
      </ContainerImage>
      <ChatTitle>
        {chatData?.contactData
          ? chatData?.contactData?.username
          : chatData?.roomData?.name}
      </ChatTitle>
      <ChatSubtitle>
        {chatData?.contactData
          ? chatData?.contactData?.status
          : chatData?.roomData?.nickname}
      </ChatSubtitle>
      {chatData?.contactData && (
        <ChatInfo>{chatData?.contactData?.email}</ChatInfo>
      )}

      {chatData?.roomData && (
        <ParticipantsContainer>
          <ParticipantsTitle>
            {participants?.length <= 1
              ? `${participants?.length} Participante`
              : `${participants?.length} Participantes`}
          </ParticipantsTitle>

          {participants?.map((participant) => (
            <ParticipantInfo
              key={Number(participant?.id)}
              admin={Boolean(participant?.user_admin)}>
              {participant?.user_admin ? (
                <ParticipantPhotoContainer>
                  <ParticipantAdminIcon />
                  <ParticipantPhoto source={{uri: participant?.photo}} />
                </ParticipantPhotoContainer>
              ) : (
                <ParticipantPhoto source={{uri: participant?.photo}} />
              )}

              <ParticipantGroupLabel>
                <ParticipantName>{participant?.username}</ParticipantName>
                <ParticipantStatus>
                  {handleLimitCharacters(String(participant?.status))}
                </ParticipantStatus>
              </ParticipantGroupLabel>

              {admin && (
                <>
                  {userData?.id === participant?.id &&
                  Boolean(participant?.user_admin) ? null : (
                    <ParticipantActionsContainer>
                      <ParticipantActionMakeOrUnmakeAdmin
                        onPress={() =>
                          handleMakeOrUnmakeUserAdmin(Number(participant?.id))
                        }>
                        <ParticipantActionMakeOrUnmakeAdminIcon
                          color={
                            participant?.user_admin
                              ? 'rgba(112, 87, 193, 0.5)'
                              : 'rgba(112, 87, 193, 0.93)'
                          }
                        />
                      </ParticipantActionMakeOrUnmakeAdmin>

                      <ParticipantActionRemove
                        onPress={() =>
                          handleRemoveUserFromRoom(Number(participant?.id))
                        }>
                        <ParticipantActionRemoveIcon />
                      </ParticipantActionRemove>
                    </ParticipantActionsContainer>
                  )}
                </>
              )}
            </ParticipantInfo>
          ))}
        </ParticipantsContainer>
      )}
    </Wrapper>
  );
};

export default ChatDetails;
