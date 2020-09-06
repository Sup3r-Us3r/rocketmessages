import React, {useState, useEffect} from 'react';
import Lottie from 'lottie-react-native';
import CodeInput from 'react-native-confirmation-code-input';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import verificationCode from '../../animations/verificationCode.json';
import success from '../../animations/success.json';
import failed from '../../animations/failed.json';

import {
  Wrapper,
  Container,
  ContainerAnimation,
  VerificationCodeLabel,
  NewPasswordLabel,
  CheckCode,
  CheckCodeLabel,
  NewPasswordInput,
  SendRequest,
  SendRequestLabel,
  codeInputStyles,
} from './styles';

const VerificationCode: React.FC = () => {
  // States
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');

  function handleCompleteCode(code: boolean) {
    if (!code) {
      return Toast.error('Código inválido');
    }

    return setChangeLayout(!changeLayout);
  }

  async function handleChangePassword() {
    const data = {
      recoveryCode: '',
      password: newPassword,
    };

    try {
      const response = await api.post('/recoverpassword/:email', data);

      if (!response) {
        return Toast.error('Erro ao recuperar senha.');
      }
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error);
    }
  }

  return (
    <Wrapper>
      <Container>
        <ContainerAnimation>
          <Lottie source={verificationCode} resizeMode="cover" autoPlay loop />
        </ContainerAnimation>

        {!changeLayout && (
          <VerificationCodeLabel>
            Informe o código que chegou no seu email, para podermos redefinir
            sua senha no próximo passo
          </VerificationCodeLabel>
        )}

        {changeLayout && (
          <NewPasswordLabel>
            Informe sua nova senha para entrar no Rocket Messages
          </NewPasswordLabel>
        )}

        {!changeLayout && (
          <CodeInput
            className="border-circle"
            keyboardType="number-pad"
            activeColor="rgba(113, 89, 193, 0.5)"
            inactiveColor="#7159c1"
            autoFocus
            ignoreCase={true}
            autoCompleteType="off"
            inputPosition="center"
            size={50}
            codeLength={5}
            codeInputStyle={codeInputStyles.input}
            // compareWithCode={}
            onFulfill={handleCompleteCode}
          />
        )}

        {changeLayout && (
          <NewPasswordInput
            placeholder="Digite a nova senha"
            secureTextEntry
            autoFocus
            autoCorrect={false}
            onChangeText={setNewPassword}
            value={newPassword}
          />
        )}

        {changeLayout && (
          <SendRequest onPress={handleChangePassword}>
            <SendRequestLabel>Resetar senha</SendRequestLabel>
          </SendRequest>
        )}
      </Container>
    </Wrapper>
  );
};

export default VerificationCode;
