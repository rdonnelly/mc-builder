import React from 'react';

import { FactionCode, SetCode } from 'src/data';
import { getFaction } from '../data/models/Faction';
import { getSet } from '../data/models/Set';

interface IDecksCreateContext {
  deckName: string;
  setDeckName: (deckName: string) => void;
  deckSet: SetCode;
  setDeckSet: (set: SetCode) => void;
  deckAspect: FactionCode[];
  setDeckAspect: (aspect: FactionCode[]) => void;
}

const DecksCreateContext = React.createContext({
  deckName: undefined,
  setDeckName: undefined,
  deckSet: undefined,
  setDeckSet: undefined,
  deckAspect: undefined,
  setDeckAspect: undefined,
} as IDecksCreateContext);

const DecksCreateProvider = (props) => {
  const [deckName, setDeckName] = React.useState(null);
  const [deckSet, setDeckSet] = React.useState(null);
  const [deckAspect, setDeckAspect] = React.useState([]);

  const updateDeckSet = (newDeckSet: SetCode) => {
    setDeckSet(newDeckSet);
    if (deckAspect.length && (deckName == null || deckName === '')) {
      const set = getSet(newDeckSet, false);
      const faction = getFaction(deckAspect[0], false);
      setDeckName(`${set.name} - ${faction.name}`);
    }
  };

  const updateDeckAspect = (newDeckAspect: FactionCode[]) => {
    setDeckAspect(newDeckAspect);
    if (deckSet && (deckName == null || deckName === '')) {
      const set = getSet(deckSet, false);
      const faction = getFaction(newDeckAspect[0], false);
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
