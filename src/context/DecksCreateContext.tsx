import React from 'react';

const DecksCreateContext = React.createContext({
  deckName: undefined,
  setDeckName: undefined,
  deckSet: undefined,
  setDeckSet: undefined,
  deckAspect: undefined,
  setDeckAspect: undefined,
});

const DecksCreateProvider = (props) => {
  const [deckName, setDeckName] = React.useState('');
  const [deckSet, setDeckSet] = React.useState('');
  const [deckAspect, setDeckAspect] = React.useState('');

  const contextValue = {
    deckName: deckName,
    setDeckName: setDeckName,
    deckSet: deckSet,
    setDeckSet: setDeckSet,
    deckAspect: deckAspect,
    setDeckAspect: setDeckAspect,
  };

  return (
    <DecksCreateContext.Provider value={contextValue}>
      {props.children}
    </DecksCreateContext.Provider>
  );
};

export { DecksCreateContext, DecksCreateProvider };
