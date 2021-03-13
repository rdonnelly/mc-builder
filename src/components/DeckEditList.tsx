import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { SectionList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CardListItem from './CardListItem';
import { CardListContext } from '../context/CardListContext';
import { CardModel, DeckModel, getEligibleCardListForDeck } from '../data';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const DeckEditList: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation();

  const { setDeckCardList } = useContext(CardListContext);

  const handlePressItem = (code: string) => {
    if (navigation) {
      const eligibleDeckCards = getEligibleCardListForDeck(deck);
      setDeckCardList(eligibleDeckCards);
      navigation.navigate('DeckEditCardDetail', {
        code,
        deckCode: deck.code,
      });
    }
  };

  const renderSectionHeader = ({ section }) => (
    <SectionHeader>
      <SectionHeaderText>{section.title}</SectionHeaderText>
      <SectionHeaderText>{section.count}</SectionHeaderText>
    </SectionHeader>
  );

  const renderCard = ({ item: card }) => (
    <CardListItem
      card={card.card}
      count={card.count || 0}
      deckCode={deck.code}
      showPackInfo={false}
      showEditControls={true}
      isSelected={false}
      onPressItem={() => handlePressItem(card.code)}
    />
  );

  return (
    <Container>
      <CardList
        sections={deck.sectionedEligibleCards}
        renderItem={renderCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: CardModel) => item.code}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </Container>
  );
};

const Container = styled(base.Container)`
  flex-direction: column;
`;

const CardList = styled(SectionList)`
  flex: 1 1 auto;
  width: 100%;
`;

const SectionHeader = styled.View`
  background-color: ${colors.darkGray};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 4px;
`;

const SectionHeaderText = styled.Text`
  color: ${colors.lightGray};
  font-weight: 800;
  text-transform: uppercase;
`;

export default DeckEditList;
