import React from 'react';

import { getFaction } from '../data/models/Faction';
import { getSet } from '../data/models/Set';

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

  const updateDeckSet = (newDeckSet: string) => {
    setDeckSet(newDeckSet);
    if (deckAspect && !deckName) {
      const set = getSet(newDeckSet, false);
      const faction = getFaction(deckAspect, false);
      setDeckName(`${set.name} - ${faction.name}`);
    }
  };

  const updateDeckAspect = (newDeckAspect: string) => {
    setDeckAspect(newDeckAspect);
    if (deckSet) {
      const set = getSet(deckSet, false);
      const faction = getFaction(newDeckAspect, false);
      setDeckName(`${set.name} - ${faction.name}`);
    }
  };

  const contextValue = {
    deckName: deckName,
    setDeckName: setDeckName,
    deckSet: deckSet,
    setDeckSet: updateDeckSet,
    deckAspect: deckAspect,
    setDeckAspect: updateDeckAspect,
  };

  return (
    <DecksCreateContext.Provider value={contextValue}>
      {props.children}
    </DecksCreateContext.Provider>
  );
};

export { DecksCreateContext, DecksCreateProvider };
