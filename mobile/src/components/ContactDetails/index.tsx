import React from 'react';

import {
  Wrapper,
  ContainerPhoto,
  Photo,
  shadowPhoto,
  Username,
  Status,
  Email,
} from './styles';

interface IContactData {
  id: number;
  username: string;
  email: string;
  photo: string;
  status?: string;
}

interface IContactDetailsProps {
  contact: IContactData;
}

const ContactDetails: React.FC<IContactDetailsProps> = ({contact}) => {
  return (
    <Wrapper>
      <ContainerPhoto style={shadowPhoto.shadow}>
        <Photo source={{uri: contact?.photo}} />
      </ContainerPhoto>
      <Username>{contact?.username}</Username>
      <Status>{contact?.status}</Status>
      <Email>{contact?.email}</Email>
    </Wrapper>
  );
};

export default ContactDetails;
