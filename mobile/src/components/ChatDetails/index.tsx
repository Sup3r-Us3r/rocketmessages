import React, {useState, useEffect} from 'react';

// import exported interface
import {ILatestMessageOfContact} from '../../screens/Chat';
import {ILatestMessageOfRoom} from '../../screens/Rooms';

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
  contactData?: ILatestMessageOfContact;
  roomData?: ILatestMessageOfRoom;
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
            nickname: chatData?.roomData?.nickname,
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

    if (chatData?.roomData?.nickname) {
      handleGetParticipants();
    }
  }, [chatData]);

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
