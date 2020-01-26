import React, { useState } from 'react';
import { Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DecksStackParamList } from '../navigation/DecksStackNavigator';
import { addDeck } from '../store/reducers/decks';
import { base, colors } from '../styles';

const DecksAddScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const [deckName, handleDeckNameChange] = useState('New Spidey Deck');
  const [deckIdentity, handleDeckIdentityChange] = useState('01001');
  const [deckAspect, handleDeckAspectChange] = useState('aggression');
  const dispatch = useDispatch();

  const submit = () => {
    dispatch(
      addDeck({
        name: deckName,
        identityCode: deckIdentity,
        aspectCode: deckAspect,
      }),
    );
  };

  return (
    <SafeAreaView>
      <Container>
        <TextInput
          autoCapitalize={'none'}
          autoCorrect={false}
          clearButtonMode={'always'}
          editable={true}
          placeholder={'Deck Name'}
          placeholderTextColor={colors.gray}
          onChangeText={(value) => handleDeckNameChange(value)}
        />
        <Button onPress={submit} title="Add Deck" />
        <Button onPress={() => navigation.goBack()} title="Dismiss" />
      </Container>
    </SafeAreaView>
  );
};

const Container = styled(base.Container)`
  padding: 16px;
`;

const TextInput = styled(base.TextInput)`
  width: 100%;
`;

export default DecksAddScreen;
