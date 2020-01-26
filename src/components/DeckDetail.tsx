import * as React from 'react';
import { Text } from 'react-native';
import styled from 'styled-components/native';

import { IDeck } from '../store/types';

import { base } from '../styles';

const DeckDetail: React.FunctionComponent<{
  deck: IDeck;
}> = ({ deck }) => {
  return (
    <Container>
      <Text>{deck.name}</Text>
    </Container>
  );
};

const Container = styled(base.Container)``;

export default DeckDetail;
