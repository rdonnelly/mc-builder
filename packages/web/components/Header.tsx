import Link from 'next/link';
import React from 'react';
import styled from 'styled-components/native';

import base from '@mc-builder/shared/src/components/base';
import { colors } from '@mc-builder/shared/src/styles';

const Header = ({
  children,
  color,
  textColor,
}: {
  children?: React.ReactNode;
  color?: string;
  textColor?: string;
}) => {
  return (
    <Container color={color}>
      <Control>
        <Link href="/">
          <Image
            resizeMode="contain"
            defaultSource={{ uri: '/images/mc-icon-76.png' }}
            source={{ uri: '/images/mc-icon-76.png' }}
          />
        </Link>
      </Control>
      <Title>
        <TitleText color={textColor}>{children}</TitleText>
      </Title>
      <Control />
    </Container>
  );
};

const Container = styled(base.Container)<{ color?: string }>`
  background-color: ${(props) => (props.color ? props.color : colors.darkGray)};
  flex: 0 0 auto;
  flex-direction: row;
  height: 48px;
  justify-content: center;
  width: 100%;
`;

const Control = styled.View`
  align-items: center;
  height: 48px;
  justify-content: center;
  width: 48px;
`;

const Title = styled.View`
  align-items: center;
  flex: 1;
  height: 48px;
  justify-content: center;
`;

const TitleText = styled.Text<{ color?: string }>`
  color: ${(props) => (props.color ? props.color : colors.white)};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: 600;
`;

const Image = styled.Image`
  height: 38px;
  width: 38px;
`;

export default Header;
