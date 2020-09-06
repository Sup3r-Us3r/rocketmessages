import React, {useContext, Dispatch, SetStateAction} from 'react';
import Lottie from 'lottie-react-native';

import AuthContext from '../../contexts/auth';

import confirm from '../../animations/confirm.json';
import rocketMessagesLogo from '../../assets/logo.png';

import {
  Wrapper,
  ScreenBackContainer,
  ScreenBackIcon,
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
  // Context
  const {signOut} = useContext(AuthContext);

  function handleCloseModal() {
    setOpenSignOutModal(false);
  }

  function handleSignOut() {
    signOut();
  }

  return openSignOutModal ? (
    <Wrapper>
      <ScreenBackContainer onPress={handleCloseModal}>
        <ScreenBackIcon />
      </ScreenBackContainer>

      <RocketMessageLogo source={rocketMessagesLogo} />

      <SignOutLabel>
        Nãooo se vá {username} está partindo porque sei que você já não mais me
        ama...
      </SignOutLabel>

      <ConfirmSignOut onPress={handleSignOut}>
        <Lottie source={confirm} resizeMode="contain" autoPlay loop={false} />
      </ConfirmSignOut>
    </Wrapper>
  ) : null;
};

export default SignOut;
