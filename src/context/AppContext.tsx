import { Dimensions, useWindowDimensions } from 'react-native';
import React from 'react';

const AppContext = React.createContext({
  windowWidth: undefined,
});

const AppProvider = (props) => {
  const window = useWindowDimensions();

  console.log(
    'AppProvider',
    window.width,
    Dimensions.get('window').width,
    Dimensions.get('screen').width,
  );

  const contextValue = {
    windowWidth: window.width,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
