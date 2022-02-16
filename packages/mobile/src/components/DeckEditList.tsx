import { SectionList, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { useDeckModifications } from '@hooks';

// import { DeckEditScreenProps } from '@navigation/DecksStackNavigator';
import CardListItem from '@mc-builder/shared/src/components/CardListItem';
import { CardModel, DeckModel } from '@mc-builder/shared/src/data';
import { getCardSectionsForDeck } from '@mc-builder/shared/src/data/deckUtils';
import { IDeckCard } from '@mc-builder/shared/src/data/models/Deck';
import { base, colors } from '@mc-builder/shared/src/styles';

// type DeckEditNavigationProps = DeckEditScreenProps['navigation'];

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 80,
  },
});

const DeckEditList = ({
  deck,
  eligibleDeckCards,
  handlePressItem,
}: {
  deck: DeckModel;
  eligibleDeckCards: IDeckCard[];
  handlePressItem?: (cardCode: string, index: number) => void;
}) => {
  const sectionedCards = getCardSectionsForDeck(eligibleDeckCards, {
    includeEmpty: true,
  });

  const { increment, incrementIsDisabled, decrement, decrementIsDisabled } =
    useDeckModifications(deck.code, deck.setCode);

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
      onPressItem={() => handlePressItem(card.code, card.index)}
      increment={increment}
      incrementIsDisabled={incrementIsDisabled}
      decrement={decrement}
      decrementIsDisabled={decrementIsDisabled}
    />
  );

  return (
    <Container>
      <CardList
        sections={sectionedCards}
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
