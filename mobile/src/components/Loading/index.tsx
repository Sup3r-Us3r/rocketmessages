import React from 'react';

import logo from '../../assets/logo.png';

import {Container, Logo, LoadingMessage, CreatedBy} from './styles';

const Loading = () => {
  return (
    <Container>
      <Logo source={logo} />
      <LoadingMessage>Rocket Messages</LoadingMessage>
      <CreatedBy>By: Mayderson Mello</CreatedBy>
    </Container>
  );
};

export default Loading;
