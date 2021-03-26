import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import CardListItem from '@components/CardListItem';

import { CardModel, DeckModel } from '@shared/data';
import { base, colors } from '@shared/styles';

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 80,
  },
});

const DeckEditList: React.FunctionComponent<{
  deck: DeckModel;
}> = ({ deck }) => {
  const navigation = useNavigation();

  const handlePressItem = useCallback(
    (code: string) => {
      if (navigation) {
        navigation.navigate('DeckEditCardDetail', {
          code,
          deckCode: deck.code,
        });
      }
    },
    [navigation, deck.code],
  );

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
      onPressItem={handlePressItem}
    />
  );

  return (
    <Container>
      <CardList
        sections={deck.eligibleCardsSectioned}
        renderItem={renderCard}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item: CardModel) => item.code}
        contentContainerStyle={styles.contentContainerStyle}
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
  font-weight: ${({ theme }) => theme.fontWeight.black};
  text-transform: uppercase;
`;

export default DeckEditList;
