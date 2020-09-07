import React, {
  useState,
  useContext,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
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

export interface ISignOutHandles {
  openModal: () => void;
}

interface ISignOutProps {
  username: string;
}

const SignOut: React.ForwardRefRenderFunction<
  ISignOutHandles,
  ISignOutProps
> = ({username}, ref) => {
  // Context
  const {signOut} = useContext(AuthContext);

  // State
  const [visible, setVisible] = useState<boolean>(false);

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  // ImperativeHandle
  useImperativeHandle(ref, () => {
    return {
      openModal,
    };
  });

  function handleCloseModal() {
    setVisible(false);
  }

  function handleSignOut() {
    signOut();
  }

  return visible ? (
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

export default forwardRef(SignOut);
