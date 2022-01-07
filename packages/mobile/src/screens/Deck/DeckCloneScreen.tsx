import 'react-native-get-random-values';

import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import DeckNameForm from '@components/DeckNameForm';
import { DeckCloneScreenProps } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';
import { cloneDeck } from '@store/actions';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectStoreDeck } from '@store/selectors';

import { base, colors } from '@mc-builder/shared/src/styles';

const DeckCloneScreen = ({ navigation, route }: DeckCloneScreenProps) => {
  const code = route.params.code;

  const deck = useAppSelector((state: StoreState) =>
    selectStoreDeck(state, code),
  );

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const submit = useCallback(
    async (deckName: string) => {
      if (deckName) {
        const deckCode = dispatch(cloneDeck(code, deckName));

        if (navigation) {
          navigation.pop();
          navigation.navigate('DeckDetail', {
            code: deckCode,
          });
        }
      }
    },
    [code, dispatch, navigation],
  );

  const cancel = useCallback(() => {
    if (navigation) {
      navigation.pop();
    }
  }, [navigation]);

  return (
    <Container paddingBottom={insets.bottom}>
      <DeckNameForm
        name={deck.name}
        submitLabel={'Clone Deck'}
        submit={submit}
        cancel={cancel}
      />
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  background-color: ${colors.lightGray};
  padding-top: 16px;
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

export default DeckCloneScreen;
