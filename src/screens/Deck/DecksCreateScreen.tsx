import React from 'react';

import { DecksCreateProvider } from '../../context/DecksCreateContext';
import DecksCreateStackNavigator from '../../navigation/DecksCreateStackNavigator';

const DecksCreateScreen: React.FunctionComponent<{}> = () => (
  <DecksCreateProvider>
    <DecksCreateStackNavigator />
  </DecksCreateProvider>
);

export default DecksCreateScreen;
