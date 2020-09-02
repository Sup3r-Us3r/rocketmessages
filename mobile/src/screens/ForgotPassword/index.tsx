import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

import api from '../../services/api';

import sentEmailSuccess from '../../animations/sentEmailSuccess.json';

import {
  Wrapper,
  ForgotPasswordContainer,
  ContainerAnimation,
  ForgotPasswordLabelBold,
  ForgotPasswordLabel,
  EmailInput,
  SendRequest,
  SendRequestLabel,
} from './styles';

const ForgotPassword: React.FC = () => {
  // Ref
  const lottieRef = useRef<Lottie>(null);

  // Navigation
  const navigation = useNavigation();

  function handleRequestNewPassword() {
    return lottieRef.current?.play();
  }

  function handleNavigateToInsertVerificationCode() {
    return navigation.navigate('VerificationCode');
  }

  return (
    <Wrapper>
      <ForgotPasswordContainer>
        <ContainerAnimation>
          <Lottie
            source={sentEmailSuccess}
            ref={lottieRef}
            resizeMode="contain"
            loop={false}
            autoPlay={false}
            onAnimationFinish={handleNavigateToInsertVerificationCode}
          />
        </ContainerAnimation>

        <ForgotPasswordLabelBold>
          Entre com o email que está associado a sua conta do Rocket Messages
        </ForgotPasswordLabelBold>
        <ForgotPasswordLabel>
          Enviaremos um email com um código de verificação para você criar uma
          nova senha
        </ForgotPasswordLabel>

        <EmailInput placeholder="Entre com seu email" autoCorrect={false} />

        <SendRequest onPress={handleRequestNewPassword}>
          <SendRequestLabel>Enviar código</SendRequestLabel>
        </SendRequest>
      </ForgotPasswordContainer>
    </Wrapper>
  );
};

export default ForgotPassword;
