import React from 'react';
import { CardModel } from '@data';

export interface ICardListContext {
  cardList: CardModel[];
  setCardList: (cardList: CardModel[]) => void;
  deckCardList: CardModel[];
  setDeckCardList: (cardList: CardModel[]) => void;
}

export const cardListContextDefaultValue: ICardListContext = {
  cardList: undefined,
  setCardList: undefined,
  deckCardList: undefined,
  setDeckCardList: undefined,
};

const CardListContext = React.createContext<ICardListContext>(
  cardListContextDefaultValue,
);

const CardListProvider = (props) => {
  const [cardList, setCardList] = React.useState([]);
  const [deckCardList, setDeckCardList] = React.useState([]);

  const contextValue = {
    cardList,
    setCardList,
    deckCardList,
    setDeckCardList,
  };

  return (
    <CardListContext.Provider value={contextValue}>
      {props.children}
    </CardListContext.Provider>
  );
};

export { CardListContext, CardListProvider };
