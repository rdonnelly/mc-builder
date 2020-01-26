import * as React from 'react';
import styled from 'styled-components/native';

import { base, colors } from '../styles';

const DecksScreen: React.FunctionComponent<{}> = () => {
  return <Container />;
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
`;

export default DecksScreen;
