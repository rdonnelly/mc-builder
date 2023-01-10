import { ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { useDeckImport } from '@hooks/useDeckImport';
import { DecksImportScreenProps } from '@navigation/DecksStackNavigator';
import { importDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import base from '@mc-builder/shared/src/components/base';
import DeckDetail from '@mc-builder/shared/src/components/DeckDetail';
import { colors } from '@mc-builder/shared/src/styles';

const DecksImportFormScreen = ({
  navigation,
  route,
}: DecksImportScreenProps) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const importString = route.params.payload;
  const { deckToImport, deckCardsToImport, deckExtraCardsToImport } =
    useDeckImport(importString);

  if (deckToImport === false) {
    Alert.alert(
      'Could Not Import Deck',
      'Please ensure that your clipboard contains either a MC Builder Share URL or a MarvelCDB public deck URL.',
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  }

  const submit = async () => {
    if (
      deckToImport &&
      deckToImport.name &&
      deckToImport.setCode &&
      deckToImport.aspectCodes.length
    ) {
      const deckCode = await dispatch(importDeck(deckToImport));

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

  if (!deckToImport) {
    return (
      <Container bottom={insets.bottom}>
        <LoadingText>Loading...</LoadingText>
        <ActivityIndicator color={colors.gray} />
      </Container>
    );
  }

  return (
    <Container bottom={insets.bottom}>
      <DeckDetail
        deck={deckToImport}
        deckCards={deckCardsToImport}
        extraCards={deckExtraCardsToImport}
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
  align-items: center;
  background-color: ${colors.lightGray};
  flex-direction: column;
  justify-content: space-around;
  padding-bottom: ${(props) => Math.max(props.bottom, 16)}px;
  padding-top: 34px;
`;

const LoadingText = styled.Text`
  color: ${colors.gray};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
`;

export default DecksImportFormScreen;
