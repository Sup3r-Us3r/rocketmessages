import React from 'react';
import Lottie from 'lottie-react-native';

import verificationCode from '../../animations/verificationCode.json';

import {
  Wrapper,
  VerificationCodeContainer,
  ContainerAnimation,
  // VerificationCodeBold,
  // VerificationCodeLabel,
  // CodeInput,
  // SendRequest,
  // SendRequestLabel,
} from './styles';

const VerificationCode: React.FC = () => {
  return (
    <Wrapper>
      <VerificationCodeContainer>
        <ContainerAnimation>
          <Lottie
            source={verificationCode}
            resizeMode="contain"
            autoPlay
            loop
          />
        </ContainerAnimation>
      </VerificationCodeContainer>
    </Wrapper>
  );
};

export default VerificationCode;
