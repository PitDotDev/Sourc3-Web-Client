import React from 'react';
import { styled } from '@linaria/react';

import { Window, Button, Footer } from '@app/shared/components';

const WarningListStyled = styled.ol`
  list-style: auto;
  padding-left: 20px;
  color: rgba(0, 0, 0, 0.5);
  margin-bottom: 24px;
  font-weight: 800;
  > li {
    position: relative;
    text-align: left;
    font-weight: 700;
    font-size: 14px;
    line-height: 24px;
  }
`;

const AuthInfo = styled.p`
  opacity: 0.5;
  text-align: left;
  line-height: 20px;
  font-size: 14px;
  font-weight: 400;
`;

interface RegistrationWarningProps {
  onClick: () => void;
}

const RegistrationWarning: React.FC<RegistrationWarningProps> = ({ onClick }) => (
  <Window padding="auth" type="auth" title="Authorization">
    <AuthInfo>SOURC3 is a decentralized platform. Therefore authorization is done through a secret phrase.</AuthInfo>
    <AuthInfo> In the next screen you will be presented with the twelve words.</AuthInfo>
    <WarningListStyled>
      <li>Copy them</li>
      <li>Keep them safe</li>
      <li>Never share them with anyone</li>
    </WarningListStyled>
    <AuthInfo>This is the only authorization you will ever need.</AuthInfo>
    <Footer>
      <Button type="button" onClick={() => onClick()}>
        Show phrase
      </Button>
    </Footer>
  </Window>
);

export default RegistrationWarning;
