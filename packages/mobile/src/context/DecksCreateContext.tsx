import { createContext, useState } from 'react';

import {
  FactionCode,
  getFaction,
  getSet,
  SetCode,
} from '@mc-builder/shared/src/data';

interface IDecksCreateContext {
  deckName: string;
  setDeckName: (deckName: string) => void;
  deckSet: SetCode;
  setDeckSet: (set: SetCode) => void;
  deckAspect: FactionCode[];
  setDeckAspect: (aspect: FactionCode[]) => void;
}

const DecksCreateContext = createContext({
  deckName: undefined,
  setDeckName: undefined,
  deckSet: undefined,
  setDeckSet: undefined,
  deckAspect: undefined,
  setDeckAspect: undefined,
} as IDecksCreateContext);

const DecksCreateProvider = (props) => {
  const [deckName, setDeckName] = useState(null);
  const [deckSet, setDeckSet] = useState(null);
  const [deckAspect, setDeckAspect] = useState([]);

  const updateDeckSet = (newDeckSet: SetCode) => {
    setDeckSet(newDeckSet);
    setDeckAspect([]);
    setDeckName(null);
  };

  const updateDeckAspect = (newDeckAspect: FactionCode[]) => {
    const set = getSet(deckSet);
    const oldFaction = getFaction(deckAspect[0], false);

    const shouldUpdateName =
      deckSet &&
      (deckName == null ||
        deckName === '' ||
        deckName === `${set.name} - ${oldFaction.name}`);

    setDeckAspect(newDeckAspect);

    if (shouldUpdateName) {
      if (newDeckAspect && newDeckAspect.length > 1) {
        setDeckName(null);
      } else {
        const newFaction = getFaction(newDeckAspect[0], false);
        if (newFaction) {
          setDeckName(`${set.name} - ${newFaction.name}`);
        } else {
          setDeckName(null);
        }
      }
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
