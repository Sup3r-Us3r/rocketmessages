import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import CodeInput from 'react-native-confirmation-code-input';

import api from '../../services/api';

import Toast from '../../config/toastStyles';

import verificationCode from '../../animations/verificationCode.json';

import {
  Wrapper,
  Container,
  ContainerAnimation,
  VerificationCodeLabel,
  NewPasswordLabel,
  NewPasswordInput,
  SendRequest,
  SendRequestLabel,
  codeInputStyles,
} from './styles';

interface IDataReceivedFromNavigation {
  email: string;
  recoverycode: string;
}

const VerificationCode: React.FC = () => {
  // Navigation
  const navigation = useNavigation();
  const dataReceivedFromNavigation = useRoute()
    .params as IDataReceivedFromNavigation;

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
      recoverycode: dataReceivedFromNavigation?.recoverycode,
      password: newPassword,
    };

    try {
      const response = await api.post(
        `/recoverpassword/${dataReceivedFromNavigation?.email}`,
        data,
      );

      if (response.status !== 200) {
        return Toast.error('Erro ao recuperar senha.');
      }

      Toast.success('Senha alterada com sucesso.');

      return navigation.navigate('Auth');
    } catch (err) {
      const {error} = err.response.data;

      return Toast.error(error ? error : 'Erro ao recuperar senha.');
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
            compareWithCode={String(dataReceivedFromNavigation?.recoverycode)}
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
