import 'react-native-get-random-values';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components/native';

import DeckNameForm from '@components/DeckNameForm';
import { DeckCloneStackParamList } from '@navigation/DeckCloneStackNavigator';
import { StoreState } from '@store';
import { cloneDeck } from '@store/actions';

import { selectStoreDeck } from '@shared/store/selectors';
import { base, colors } from '@shared/styles';

const DeckCloneScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DeckCloneStackParamList, 'DeckClone'>;
  route: RouteProp<DeckCloneStackParamList, 'DeckClone'>;
}> = ({ navigation, route }) => {
  const code = route.params.code;

  const deck = useSelector((state: StoreState) => selectStoreDeck(state, code));

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const submit = useCallback(
    async (deckName: string) => {
      if (deckName) {
        const deckCode = dispatch(cloneDeck(code, deckName));

        if (navigation) {
          navigation.pop();
          // @ts-ignore
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
