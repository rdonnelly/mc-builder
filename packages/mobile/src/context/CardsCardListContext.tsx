import React from 'react';

import { CardModel } from '@data';

export interface ICardsCardListContext {
  cardList: CardModel[];
  setCardsCardList: (cardList: CardModel[]) => void;
}

export const cardListContextDefaultValue: ICardsCardListContext = {
  cardList: undefined,
  setCardsCardList: undefined,
};

const CardsCardListContext = React.createContext<ICardsCardListContext>(
  cardListContextDefaultValue,
);

const CardsCardListProvider = (props) => {
  const [cardList, setCardsCardList] = React.useState([]);
  const [deckCardList, setDeckCardList] = React.useState([]);

  const contextValue = {
    cardList,
    setCardsCardList,
    deckCardList,
    setDeckCardList,
  };

  return (
    <CardsCardListContext.Provider value={contextValue}>
      {props.children}
    </CardsCardListContext.Provider>
  );
};

export { CardsCardListContext, CardsCardListProvider };
