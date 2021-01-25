import 'react-native-get-random-values';
import { Alert, ListRenderItem } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import styled from 'styled-components/native';

import {
  CardModel,
  FactionCode,
  FactionCodes,
  FilterCodes,
  SetCode,
  TypeCodes,
  getFilteredCards,
  getSet,
} from '../../data';
import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { base, colors } from '../../styles';
import { setUpNewDeck } from '../../store/actions';
import CardListItem from '../../components/CardListItem';
import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '../../components/FloatingControlBar';

const DecksImportFormScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksImport'>;
  route: RouteProp<DecksStackParamList, 'DecksImport'>;
}> = ({ navigation, route }) => {
  const deck = route.params.deck;
  let deckSetCode: SetCode = null;
  let deckAspectCodes: FactionCode[] = [];

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  let filteredDeckCards = getFilteredCards({
    cardCodes: Object.keys(deck.cards),
  });

  filteredDeckCards = filteredDeckCards.filter((card) => {
    if (
      card.typeCode === TypeCodes.ALTER_EGO ||
      card.typeCode === TypeCodes.HERO
    ) {
      deckSetCode = card.setCode;
    }

    if (card.setCode == null) {
      if (
        [
          FactionCodes.AGGRESSION,
          FactionCodes.JUSTICE,
          FactionCodes.LEADERSHIP,
          FactionCodes.PROTECTION,
        ].includes(card.factionCode as FactionCodes)
      ) {
        deckAspectCodes.push(card.factionCode);
      }

      return true;
    }

    return false;
  });

  deckAspectCodes = deckAspectCodes.filter((value, index, self) => {
    return self.indexOf(value) === index;
  });

  const set = getSet(deckSetCode);

  const setCards = getFilteredCards({
    filter: FilterCodes.SET,
    filterCode: deckSetCode,
  }).filter((card) => card.factionCode !== FactionCodes.ENCOUNTER);

  const identityImageSrcs = setCards
    .filter(
      (card) =>
        card.typeCode === TypeCodes.ALTER_EGO ||
        card.typeCode === TypeCodes.HERO,
    )
    .map((card) => card.imageSrc || null);

  const importDeck = () => {
    const deckCode = uuidv4();
    if (deck.name && deckSetCode && deckAspectCodes.length) {
      const deckCards = filteredDeckCards.map((card) => ({
        code: card.code,
        quantity: deck.cards[card.code],
      }));

      dispatch(
        setUpNewDeck(
          deckCode,
          deck.name,
          deckSetCode,
          deckAspectCodes,
          deck.version,
          deckCards,
          deck.code,
          deck.mcdbId,
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
        'Clipboard content is on in a compatible format.',
      );
    }
  };

  const renderCard: ListRenderItem<CardModel> = ({ item: card }) => (
    <CardListItem
      card={card}
      count={card.setCode == null ? deck.cards[card.code] : card.setQuantity}
      isSelected={false}
      showPackInfo={false}
    />
  );

  return (
    <Container bottom={insets.bottom}>
      <Identities>
        {identityImageSrcs.map((src) =>
          src ? (
            <IdentityWrapper>
              <IdentityImage source={{ uri: src }} />
            </IdentityWrapper>
          ) : null,
        )}
      </Identities>
      <Info>
        <TitleWrapper>
          <Title>{deck.name}</Title>
        </TitleWrapper>
        <TraitsWrapper>
          <Traits>
            {set.name} –{' '}
            {deckAspectCodes
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
      <FlatList
        renderItem={renderCard}
        data={[].concat(setCards, filteredDeckCards)}
        keyExtractor={(card: CardModel) => card.code}
        contentContainerStyle={{ paddingBottom: 48 }}
      />
      <FloatingControlBar>
        <FloatingControlBar.FlexButton
          onPress={() => navigation.goBack()}
          variant={FloatingControlButtonVariant.SUBDUED}
        >
          Cancel
        </FloatingControlBar.FlexButton>
        <FloatingControlBar.FlexButton
          onPress={() => importDeck()}
          variant={FloatingControlButtonVariant.SUCCESS}
        >
          Import Deck
        </FloatingControlBar.FlexButton>
      </FloatingControlBar>
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

const FlatList = styled(base.FlatList)``;

export default DecksImportFormScreen;
