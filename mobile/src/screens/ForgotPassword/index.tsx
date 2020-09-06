import React, {useState, useRef} from 'react';
import {ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Lottie from 'lottie-react-native';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

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

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>('');

  // Navigation
  const navigation = useNavigation();

  async function handleSendVerificationCode() {
    try {
      if (emailInput === '') {
        return Toast.error('O email é um campo obrigatório.');
      }

      setLoading(true);

      const response = await api.get(`/forgotpassword/${emailInput}`);

      if (response.status !== 200) {
        return Toast.error('Erro ao enviar solicitação.');
      }

      return lottieRef.current?.play();
    } catch (err) {
      const {error} = err.response.data;

      setTimeout(() => setLoading(false), 1000);

      setEmailInput('');

      return Toast.error(error ? error : 'Erro ao enviar solicitação');
    }
  }

  function handleNavigateToVerificationCode() {
    setLoading(false);

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
            onAnimationFinish={handleNavigateToVerificationCode}
          />
        </ContainerAnimation>

        <ForgotPasswordLabelBold>
          Entre com o email que está associado a sua conta do Rocket Messages
        </ForgotPasswordLabelBold>
        <ForgotPasswordLabel>
          Enviaremos um email com um código de verificação para você criar uma
          nova senha
        </ForgotPasswordLabel>

        <EmailInput
          placeholder="Entre com seu email"
          autoCorrect={false}
          autoFocus
          onChangeText={setEmailInput}
          value={emailInput}
          loading={loading}
        />

        {loading ? (
          <SendRequest disabled>
            <ActivityIndicator
              color="#fff"
              size="small"
              // eslint-disable-next-line react-native/no-inline-styles
              style={{paddingVertical: 0.8}}
            />
          </SendRequest>
        ) : (
          <SendRequest onPress={handleSendVerificationCode} disabled={loading}>
            <SendRequestLabel>Enviar código</SendRequestLabel>
          </SendRequest>
        )}
      </ForgotPasswordContainer>
    </Wrapper>
  );
};

export default ForgotPassword;
