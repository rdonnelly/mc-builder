import { SectionList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';
import CardListItem from './CardListItem';

export const ITEM_HEIGHT = 64;

const DeckEditList: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation();

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckEditCardDetail', {
        code,
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
        keyExtractor={(item) => item.code || item.title}
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
