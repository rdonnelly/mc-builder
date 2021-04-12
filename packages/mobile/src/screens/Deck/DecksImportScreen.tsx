import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Alert, ListRenderItem, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { importDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import CardListItem from '@shared/components/CardListItem';
import { CardModel } from '@shared/data';
import { useDeckImport } from '@shared/hooks';
import { base, colors } from '@shared/styles';

const styles = StyleSheet.create({
  contentContainerStyle: {
    paddingBottom: 48,
  },
});

const DecksImportFormScreen = ({
  navigation,
  route,
}: {
  navigation: StackNavigationProp<DecksStackParamList, 'DecksImport'>;
  route: RouteProp<DecksStackParamList, 'DecksImport'>;
}) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const importString = route.params.importString;
  const {
    deckToImport,
    deckCardModels,
    aspectCodes,
    setCode,
    set,
    setCardModels,
    identityImageSrcs,
  } = useDeckImport(importString);

  // if (importDeck === false) {
  //   Alert.alert(
  //     'Could Not Import Deck',
  //     'Please ensure that you have either a MarvelCDB public deck URL or a deck in shareable text format on your clipboard.',
  //   );
  //
  //   return;
  // }

  const submit = async () => {
    if (deckToImport && deckToImport.name && setCode && aspectCodes.length) {
      const deckCode = await dispatch(
        importDeck(deckToImport, deckCardModels, setCode, aspectCodes),
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
      count={
        card.setCode == null && deckToImport
          ? deckToImport.cards[card.code]
          : card.setQuantity
      }
      showPackInfo={false}
    />
  );

  // TODO better loading indicator
  if (!deckToImport) {
    return (
      <Container bottom={insets.bottom}>
        <Info>
          <TitleWrapper>
            <Title>{deckToImport ? deckToImport.name : 'Loading'}</Title>
          </TitleWrapper>
        </Info>
      </Container>
    );
  }

  return (
    <Container bottom={insets.bottom}>
      <Identities>
        {identityImageSrcs.map((src, i) =>
          src ? (
            <IdentityWrapper key={`identity_image_${i}`}>
              <IdentityImage source={{ uri: src }} />
            </IdentityWrapper>
          ) : null,
        )}
      </Identities>
      <Info>
        <TitleWrapper>
          <Title>{deckToImport ? deckToImport.name : 'Loading'}</Title>
        </TitleWrapper>
        <TraitsWrapper>
          <Traits>
            {set.name} –{' '}
            {aspectCodes
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
        data={[].concat(setCardModels, deckCardModels)}
        keyExtractor={(card: CardModel) => card.code}
        contentContainerStyle={styles.contentContainerStyle}
      />
      <FloatingControlBar>
        <FloatingControlBar.FlexButton
          onPress={() => navigation.goBack()}
          variant={FloatingControlButtonVariant.SUBDUED}
        >
          Cancel
        </FloatingControlBar.FlexButton>
        <FloatingControlBar.FlexButton
          onPress={() => submit()}
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
  border-radius: ${({ theme }) => theme.borderRadius.lg};
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
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.black};
  text-align: center;
`;

const TraitsWrapper = styled.View``;

const Traits = styled.Text`
  color: ${colors.grayDark};
  font-size: ${({ theme }) => theme.fontSize.list};
  text-align: center;
`;

const FlatList = styled(base.FlatList)``;

export default DecksImportFormScreen;
