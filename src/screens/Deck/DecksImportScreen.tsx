import 'react-native-get-random-values';
import { Alert, ListRenderItem, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext } from 'react';
import styled from 'styled-components/native';

import {
  CardModel,
  getFilteredCards,
  getIdentityCards,
  getSet,
} from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { base, colors } from '../../styles';
import { setUpNewDeck } from '../../store/actions';
import CardListItem from '../../components/CardListItem';

const DecksImportFormScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksImport'>;
  route: RouteProp<DecksStackParamList, 'DecksImport'>;
}> = ({ navigation, route }) => {
  const deck = route.params.deck;
  const deckSet = getSet(deck.setCode);

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const deckCardCodesMap = deck.cards.reduce((map, c) => {
    map[c.code] = c.quantity;
    return map;
  }, {});

  const filteredDeckCards = getFilteredCards({
    cardCodes: Object.keys(deckCardCodesMap),
  });

  const importDeck = () => {
    const deckCode = uuidv4();
    if (deck.name && deck.setCode && deck.aspectCodes.length) {
      dispatch(
        setUpNewDeck(
          deckCode,
          deck.name,
          deck.setCode,
          deck.aspectCodes,
          deck.cards,
        ),
      );

      if (navigation) {
        navigation.goBack();
        navigation.navigate('DeckDetail', {
          code: deckCode,
        });
      }
    } else {
      Alert.alert(
        'Could Not Import Deck',
        'Deck content on clipboard is not readable.',
      );
    }
  };

  const identityCards = getIdentityCards(deck.setCode);

  const heroCard = identityCards.hero;
  const heroCardImageSrc = heroCard ? heroCard.imageSrc : null;

  const alterEgoCard = identityCards.alterEgo;
  const alterEgoCardImageSrc = alterEgoCard ? alterEgoCard.imageSrc : null;

  const renderCard: ListRenderItem<CardModel> = ({ item: card }) => (
    <CardListItem
      card={card}
      count={deckCardCodesMap[card.code]}
      isSelected={false}
      showPackInfo={false}
    />
  );

  return (
    <Container bottom={insets.bottom}>
      <Identities>
        <IdentityWrapper>
          {heroCardImageSrc ? (
            <IdentityImage source={{ uri: heroCardImageSrc }} />
          ) : null}
        </IdentityWrapper>
        <IdentityWrapper>
          {alterEgoCardImageSrc ? (
            <IdentityImage source={{ uri: alterEgoCardImageSrc }} />
          ) : null}
        </IdentityWrapper>
      </Identities>
      <Info>
        <TitleWrapper>
          <Title>{deck.name}</Title>
        </TitleWrapper>
        <TraitsWrapper>
          <Traits>
            {deckSet.name} –{' '}
            {deck.aspectCodes
              .map(
                (aspect) =>
                  `${aspect.charAt(0).toUpperCase()}${aspect
                    .substr(1)
                    .toLowerCase()}`,
              )
              .join(', ')}
          </Traits>
        </TraitsWrapper>
      </Info>
      <base.FlatList
        renderItem={renderCard}
        data={filteredDeckCards}
        keyExtractor={(card: CardModel) => card.code}
        contentContainerStyle={{ paddingBottom: 48 }}
      />
      <FloatingControls>
        <FloatingControlsCancelButtonWrapper
          onPress={() => navigation.goBack()}
        >
          {({ pressed }) => (
            <FloatingControlsCancelButton pressed={pressed}>
              <FloatingControlsButtonText pressed={pressed}>
                Cancel
              </FloatingControlsButtonText>
            </FloatingControlsCancelButton>
          )}
        </FloatingControlsCancelButtonWrapper>
        <FloatingControlsImportButtonWrapper onPress={() => importDeck()}>
          {({ pressed }) => (
            <FloatingControlsImportButton pressed={pressed}>
              <FloatingControlsButtonText pressed={pressed}>
                Import Deck
              </FloatingControlsButtonText>
            </FloatingControlsImportButton>
          )}
        </FloatingControlsImportButtonWrapper>
      </FloatingControls>
    </Container>
  );
};

const Container = styled(base.Container)<{ bottom: number }>`
  background-color: ${colors.lightGray};
  padding-top: 32px;
  padding-bottom: ${(props) => Math.max(props.bottom, 16)}px;
`;

const Identities = styled.View`
  flex-direction: row;
  padding: 16px;
`;

const IdentityWrapper = styled.View`
  background-color: ${colors.lightGray};
  border: 2px solid ${colors.white};
  border-radius: 8px;
  height: 96px;
  margin-horizontal: 8px;
  overflow: hidden;
  width: 96px;
`;

const IdentityImage = styled.Image`
  height: 176px;
  width: 176px;
  left: -50%;
`;

const Info = styled.View`
  border-bottom-color: ${colors.gray};
  border-bottom-width: 4px;
  padding-bottom: 16px;
  width: 100%;
`;

const TitleWrapper = styled.View`
  margin-bottom: 8px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 900;
  text-align: center;
`;

const TraitsWrapper = styled.View``;

const Traits = styled.Text`
  color: ${colors.grayDark};
  font-size: 18px;
  text-align: center;
`;

const CardList = styled.SectionList`
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

const FloatingControls = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  border-radius: 4px;
  bottom: 8px;
  flex-direction: row;
  left: 8px;
  padding: 8px 4px;
  position: absolute;
  right: 8px;
`;

const FloatingControlsButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlsCancelButtonWrapper = styled(
  FloatingControlsButtonWrapper,
)`
  flex: 1 1 0;
`;

const FloatingControlsCancelButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.grayDark : colors.gray};
`;

const FloatingControlsImportButtonWrapper = styled(
  FloatingControlsButtonWrapper,
)`
  flex: 1 1 auto;
`;

const FloatingControlsImportButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.greenDark : colors.green};
`;

const FloatingControlsButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

export default DecksImportFormScreen;
