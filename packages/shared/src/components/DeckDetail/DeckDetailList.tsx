import { memo } from 'react';
import { SectionList, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import CardListItem from '../../components/CardListItem';
import { CardModel, DeckModel } from '../../data';
import { colors } from '../../styles';

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 80,
  },
});

const DeckDetailList = ({
  deck,
  handlePressItem,
}: {
  deck: DeckModel;
  handlePressItem: (cardCode: string) => void;
}) => {
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
      onPressItem={handlePressItem}
    />
  );

  return (
    <CardList
      sections={deck.cardsSectioned}
      renderItem={renderCard}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item: CardModel) => item.code}
      contentContainerStyle={styles.contentContainerStyle}
    />
  );
};

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

export default memo(DeckDetailList);
