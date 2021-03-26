import React from 'react';

import { CardModel } from '@shared/data';

export interface IDecksCardListContext {
  cardList: CardModel[];
  setDecksCardList: (cardList: CardModel[]) => void;
}

export const cardListContextDefaultValue: IDecksCardListContext = {
  cardList: undefined,
  setDecksCardList: undefined,
};

const DecksCardListContext = React.createContext<IDecksCardListContext>(
  cardListContextDefaultValue,
);

const DecksCardListProvider = (props) => {
  const [cardList, setDecksCardList] = React.useState([]);

  const contextValue = {
    cardList,
    setDecksCardList,
  };

  return (
    <DecksCardListContext.Provider value={contextValue}>
      {props.children}
    </DecksCardListContext.Provider>
  );
};

export { DecksCardListContext, DecksCardListProvider };
