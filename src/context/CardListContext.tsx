import React from 'react';

import { getCards } from '../data';

const CardListContext = React.createContext({
  cardList: undefined,
  setCardList: undefined,
});

const CardListProvider = (props) => {
  const [cardList, setCardList] = React.useState(getCards());

  const contextValue = {
    cardList: cardList,
    setCardList: setCardList,
  };

  return (
    <CardListContext.Provider value={contextValue}>
      {props.children}
    </CardListContext.Provider>
  );
};

export { CardListContext, CardListProvider };
