import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useRef } from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { addCardToDeck, removeCardFromDeck } from '../store/reducers/decks';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const DeckEditList: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const dispatch = useDispatch();
  const listRef = useRef(null);

  const increment = (cardCode: string) =>
    dispatch(addCardToDeck({ cardCode, deckCode: deck.code }));

  const decrement = (cardCode: string) =>
    dispatch(removeCardFromDeck({ cardCode, deckCode: deck.code }));

  const renderItem = ({ item: card }) => (
    <DeckEditListCard>
      <CardInfo>
        <CardName>
          <CardNameText>{card.name}</CardNameText>
        </CardName>
      </CardInfo>
      <CardControls>
        <CardCountIncrementButton onPress={() => increment(card.code)}>
          <FontAwesomeIcon name="plus" color={colors.white} size={16} />
        </CardCountIncrementButton>
        <CardCountDecrementButton onPress={() => decrement(card.code)}>
          <FontAwesomeIcon name="minus" color={colors.white} size={16} />
        </CardCountDecrementButton>
        <CardCount>
          <CardCountText>{card.count}</CardCountText>
        </CardCount>
      </CardControls>
    </DeckEditListCard>
  );

  return (
    <Container>
      <FlatList
        ref={listRef}
        renderItem={renderItem}
        data={deck.cards}
        keyExtractor={(item) => item.code}
      />
    </Container>
  );
};

const Container = styled(base.Container)`
  flex-direction: column;
`;

const FlatList = styled(base.FlatList)``;

const DeckEditListCard = styled(base.Container)`
  background-color: ${colors.lightGray};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  height: ${ITEM_HEIGHT}px;
  justify-content: center;
  padding-horizontal: 16px;
`;

const CardInfo = styled.View`
  align-items: flex-start;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  padding-right: 8px;
`;

const CardName = styled.View``;

const CardNameText = styled.Text`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const CardControls = styled.View`
  flex-direction: row;
`;

const CardCountButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${colors.gray};
  border-radius: 4px;
  justify-content: center;
  margin-right: 4px;
  height: 32px;
  width: 32px;
`;

const CardCountIncrementButton = styled(CardCountButton)`
  background-color: ${colors.green};
`;

const CardCountDecrementButton = styled(CardCountButton)`
  background-color: ${colors.red};
`;

const CardCount = styled.View`
  align-items: center;
  background-color: ${colors.gray};
  border-radius: 4px;
  justify-content: center;
  height: 32px;
  width: 32px;
`;

const CardCountText = styled.Text`
  color: ${colors.white};
  font-size: 16px;
  font-weight: 800;
`;

export default DeckEditList;
