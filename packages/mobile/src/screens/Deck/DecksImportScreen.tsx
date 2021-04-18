import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import FloatingControlBar, {
  FloatingControlButtonVariant,
} from '@components/FloatingControlBar';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { importDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import DeckDetail from '@shared/components/DeckDetail';
import { useDeckImport } from '@shared/hooks';
import { base, colors } from '@shared/styles';

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
  const { deckToImport } = useDeckImport(importString);

  // if (importDeck === false) {
  //   Alert.alert(
  //     'Could Not Import Deck',
  //     'Please ensure that you have either a MarvelCDB public deck URL or a deck in shareable text format on your clipboard.',
  //   );
  //
  //   return;
  // }

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
      <DeckDetail deck={deckToImport} />
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
