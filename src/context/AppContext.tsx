import React from 'react';
import { useWindowDimensions } from 'react-native';

const AppContext = React.createContext({
  windowWidth: undefined,
});

const AppProvider = (props) => {
  const window = useWindowDimensions();

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
