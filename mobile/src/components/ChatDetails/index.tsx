import React, {useState, useEffect} from 'react';

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
  ParticipantPhoto,
  ParticipantGroupLabel,
  ParticipantName,
  ParticipantStatus,
} from './styles';

interface IDataReceivedFromNavigation {
  key?: string;
  id?: number;
  name?: string;
  nickname?: string;
  username?: string;
  email?: string;
  avatar?: string;
  photo?: string;
  status?: string;
  message?: string;
  image?: string;
  created_at?: string;
}

interface IChatDetailsProps {
  chatData: IDataReceivedFromNavigation;
}

interface IParticipants {
  id: number;
  username: string;
  email: string;
  status: string;
  photo: string;
  created_at: Date;
}

const ChatDetails: React.FC<IChatDetailsProps> = ({chatData}) => {
  // States
  const [participants, setParticipants] = useState<IParticipants[]>([]);

  function handleLimitCharacters(text: string) {
    return text.length >= 30 ? text.substr(0, 30) + '...' : text;
  }

  useEffect(() => {
    async function handleGetParticipants() {
      try {
        const users = await api.get<IParticipants[]>('/usersinroom', {
          params: {
            nickname: chatData?.nickname,
          },
        });

        if (!users) {
          return Toast.error('Erro ao listar participantes.');
        }

        return setParticipants(users.data);
      } catch (err) {
        const {error} = err.response.data;

        return Toast.error(error);
      }
    }

    if (chatData?.nickname) {
      handleGetParticipants();
    }
  }, [chatData]);

  return (
    <Wrapper>
      <ContainerImage style={shadowPhoto.shadow}>
        <Photo
          source={{uri: chatData?.photo ? chatData?.photo : chatData?.avatar}}
        />
      </ContainerImage>
      <ChatTitle>
        {chatData?.username ? chatData?.username : chatData?.name}
      </ChatTitle>
      <ChatSubtitle>
        {chatData?.status ? chatData?.status : chatData?.nickname}
      </ChatSubtitle>
      {chatData?.email && <ChatInfo>{chatData?.email}</ChatInfo>}

      {chatData?.nickname && (
        <ParticipantsContainer>
          <ParticipantsTitle>
            {participants?.length === 1
              ? `${participants?.length} Participante`
              : `${participants?.length} Participantes`}
          </ParticipantsTitle>

          {participants?.map((participant) => (
            <ParticipantInfo key={Number(participant?.id)}>
              <ParticipantPhoto source={{uri: participant?.photo}} />
              <ParticipantGroupLabel>
                <ParticipantName>{participant?.username}</ParticipantName>
                <ParticipantStatus>
                  {handleLimitCharacters(String(participant?.status))}
                </ParticipantStatus>
              </ParticipantGroupLabel>
            </ParticipantInfo>
          ))}
        </ParticipantsContainer>
      )}
    </Wrapper>
  );
};

export default ChatDetails;
