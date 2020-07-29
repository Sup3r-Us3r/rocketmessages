import React from 'react';

import {
  Wrapper,
  shadowContainer,
  ModalActions,
  ModalButton,
  ModalButtonLabel,
} from './styles';

interface IModalProps {
  toogleModal: boolean;
}

const ShowModalEditTextInput: React.FC<IModalProps> = ({
  children,
  toogleModal,
}) => {
  return toogleModal ? (
    <Wrapper style={shadowContainer.shadowBox}>
      {children}

      <ModalActions>
        <ModalButton>
          <ModalButtonLabel>Cancelar</ModalButtonLabel>
        </ModalButton>

        <ModalButton>
          <ModalButtonLabel>Salvar</ModalButtonLabel>
        </ModalButton>
      </ModalActions>
    </Wrapper>
  ) : null;
};

export default ShowModalEditTextInput;
