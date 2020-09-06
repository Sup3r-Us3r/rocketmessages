import React, {Dispatch, SetStateAction} from 'react';
import Lottie from 'lottie-react-native';

import success from '../../animations/success.json';
import rocketMessagesLogo from '../../assets/logo.png';

import {
  Wrapper,
  RocketMessageLogo,
  SignOutLabel,
  ConfirmSignOut,
} from './styles';

interface ISignOutProps {
  username: string;
  openSignOutModal: boolean;
  setOpenSignOutModal: Dispatch<SetStateAction<boolean>>;
}

const SignOut: React.FC<ISignOutProps> = ({
  username,
  openSignOutModal,
  setOpenSignOutModal,
}) => {
  function handleCloseModal() {
    setOpenSignOutModal(true);
  }

  return openSignOutModal ? (
    <Wrapper>
      <RocketMessageLogo source={rocketMessagesLogo} />

      <SignOutLabel>
        Nãooo! que isso {username} já tá indo? fica mais
      </SignOutLabel>

      <ConfirmSignOut>
        <Lottie
          source={success}
          resizeMode="contain"
          autoPlay
          loop={false}
          // onAnimationFinish={}
        />
      </ConfirmSignOut>
    </Wrapper>
  ) : null;
};

export default SignOut;
