import 'react-native-get-random-values';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import styled from 'styled-components/native';

import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import { base, colors } from '../../styles';
import { updateDeck } from '../../store/reducers/decks';
import DeckNameForm from '../../components/DeckNameForm';

const DeckRenameScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DeckRename'>;
  route: RouteProp<DecksStackParamList, 'DeckRename'>;
}> = ({ navigation, route }) => {
  const code = route.params.code;

  const deck = useSelector(
    (state: StoreState) => state.root.decks.entities[code],
  );

  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const submit = (deckName: string) => {
    if (deckName) {
      dispatch(updateDeck({ code, name: deckName }));

      if (navigation) {
        navigation.pop();
      }
    }
  };

  const cancel = () => {
    if (navigation) {
      navigation.pop();
    }
  };

  return (
    <Container paddingBottom={insets.bottom}>
      <DeckNameForm name={deck.name} submit={submit} cancel={cancel} />
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  background-color: ${colors.lightGray};
  padding-top: 16px;
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

export default DeckRenameScreen;
