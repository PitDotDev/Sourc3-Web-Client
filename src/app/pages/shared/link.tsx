import React from 'react';
import { styled } from '@linaria/react';

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {}

const LinkStyled = styled.a<LinkProps>`
  display: inline-block;
  margin: 30px 0;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
  text-decoration: none;
`;

const Link: React.FC<LinkProps> = ({ children, ...rest }) => (
  <LinkStyled href="#" {...rest}>
    {children}
  </LinkStyled>
);

export default Link;