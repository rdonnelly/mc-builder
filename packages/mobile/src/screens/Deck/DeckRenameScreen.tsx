import 'react-native-get-random-values';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import DeckNameForm from '@components/DeckNameForm';
import { DecksStackParamList } from '@navigation/DecksStackNavigator';
import { StoreState } from '@store';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { updateDeck } from '@store/reducers/decks';
import { selectStoreDeck } from '@store/selectors';

import { base, colors } from '@shared/styles';

export type DeckRenameScreenNavigationProp = StackNavigationProp<
  DecksStackParamList,
  'DeckRename'
>;

const DeckRenameScreen = ({
  navigation,
  route,
}: {
  navigation: DeckRenameScreenNavigationProp;
  route: RouteProp<DecksStackParamList, 'DeckRename'>;
}) => {
  const code = route.params.code;

  const deck = useAppSelector((state: StoreState) =>
    selectStoreDeck(state, code),
  );

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const submit = useCallback(
    (deckName: string) => {
      if (deckName) {
        dispatch(updateDeck({ code, name: deckName }));

        if (navigation) {
          navigation.pop();
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
        submitLabel={'Rename Deck'}
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

export default DeckRenameScreen;
