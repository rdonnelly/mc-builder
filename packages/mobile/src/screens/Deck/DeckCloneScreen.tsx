import { useCallback } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import DeckNameForm from '@components/DeckNameForm';
import { DeckCloneScreenProps } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';
import { cloneDeck } from '@store/actions';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectStoreDeck } from '@store/selectors';

import base from '@mc-builder/shared/src/components/base';
import { colors } from '@mc-builder/shared/src/styles';

const isIOS = Platform.OS === 'ios';
const HEADER_HEIGHT = isIOS ? 44 : 56;

const DeckCloneScreen = ({ navigation, route }: DeckCloneScreenProps) => {
  const code = route.params.code;

  const deck = useAppSelector((state: StoreState) =>
    selectStoreDeck(state, code),
  );

  const dispatch = useAppDispatch();

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

  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      behavior={isIOS ? 'padding' : undefined}
      keyboardVerticalOffset={HEADER_HEIGHT}
    >
      <Container paddingBottom={insets.bottom}>
        <DeckNameForm
          name={deck.name}
          submitLabel={'Clone Deck'}
          submit={submit}
          cancel={cancel}
        />
      </Container>
    </KeyboardAvoidingView>
  );
};

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1 1 auto;
  width: 100%;
`;

const Container = styled(base.Container)<{ paddingBottom: number }>`
  background-color: ${colors.slate100};
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

export default DeckCloneScreen;
