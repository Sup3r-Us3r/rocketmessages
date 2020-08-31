import React, {RefObject} from 'react';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import {
  Wrapper,
  Title,
  Container,
  ActionButtonContainer,
  ActionButtonLabel,
} from './styles';

interface IModalizeOption {
  close(): void;
}

interface ILeaveRoomProps {
  modalRef: RefObject<IModalizeOption>;
  userId: number;
  roomId: number;
}

const LeaveRoom: React.FC<ILeaveRoomProps> = ({modalRef, userId, roomId}) => {
  async function handleLeaveRoom() {
    try {
      const leaveRoom = await api.delete(
        `/deleteuserfromroom/${userId}/${roomId}`,
      );

      if (!leaveRoom) {
        return Toast.error('Erro ao sair do grupo.');
      }

      Toast.success('Você saiu do grupo.');

      return modalRef.current?.close();
    } catch (err) {
      const {error} = err.response.data;

      Toast.error(error);

      return modalRef.current?.close();
    }
  }

  function handleCloseModal() {
    return modalRef.current?.close();
  }

  return (
    <Wrapper>
      <Title>Deseja sair do grupo?</Title>

      <Container>
        <ActionButtonContainer onPress={handleLeaveRoom}>
          <ActionButtonLabel>Confirmar</ActionButtonLabel>
        </ActionButtonContainer>

        <ActionButtonContainer onPress={handleCloseModal}>
          <ActionButtonLabel>Cancelar</ActionButtonLabel>
        </ActionButtonContainer>
      </Container>
    </Wrapper>
  );
};

export default LeaveRoom;
