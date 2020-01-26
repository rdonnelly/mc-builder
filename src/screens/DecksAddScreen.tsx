import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import uuidv4 from 'uuid/v4';

import { DecksStackParamList } from '../navigation/DecksStackNavigator';
import { addDeck } from '../store/reducers/decks';
import { base, colors } from '../styles';
import { getPrimaryFactions } from '../data/models/Faction';
import { getSets } from '../data/models/Set';

const DecksAddScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const [deckName, handleDeckNameChange] = useState('New Black Panther Deck');
  const [deckSet, handleDeckSetChange] = useState('black_panther');
  const [deckAspect, handleDeckAspectChange] = useState('protection');
  const dispatch = useDispatch();

  const sets = getSets();
  const aspects = getPrimaryFactions();

  const insets = useSafeArea();

  const submit = () => {
    const deckCode = uuidv4();
    dispatch(
      addDeck({
        code: deckCode,
        name: deckName,
        setCode: deckSet,
        aspectCode: deckAspect,
      }),
    );

    if (navigation) {
      navigation.navigate('DeckDetail', {
        code: deckCode,
      });
    }
  };

  return (
    <Container paddingBottom={insets.bottom}>
      <Form>
        <TextInput
          autoCapitalize={'none'}
          autoCorrect={false}
          clearButtonMode={'always'}
          editable={true}
          placeholder={'Deck Name'}
          placeholderTextColor={colors.gray}
          onChangeText={(value) => handleDeckNameChange(value)}
        />

        <Picker
          selectedValue={deckSet}
          onValueChange={(value) => handleDeckSetChange(value)}
        >
          {sets.map((faction) => (
            <Picker.Item
              label={faction.name}
              value={faction.code}
              key={faction.code}
            />
          ))}
        </Picker>

        <Picker
          selectedValue={deckAspect}
          onValueChange={(value) => handleDeckAspectChange(value)}
        >
          {aspects.map((faction) => (
            <Picker.Item
              label={faction.name}
              value={faction.code}
              key={faction.code}
            />
          ))}
        </Picker>
      </Form>

      <Controls>
        <AddButton onPress={submit}>
          <AddButtonText>Add Deck</AddButtonText>
        </AddButton>
        <CancelButton onPress={() => navigation.goBack()}>
          <CancelButtonText>Cancel</CancelButtonText>
        </CancelButton>
      </Controls>
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  padding-horizontal: 16px;
  padding-bottom: ${(props) => props.paddingBottom}px;
`;

const Form = styled.View`
  flex: 1 1 auto;
  width: 100%;
`;

const TextInput = styled(base.TextInput)`
  width: 100%;
`;

const Picker = styled.Picker`
  height: 200px;
  width: 100%;
`;

const Controls = styled.View`
  flex-direction: row;
`;

const AddButton = styled(base.Button)`
  background-color: ${colors.green};
  flex: 1;
  margin-right: 8px;
`;

const AddButtonText = styled(base.ButtonText)``;

const CancelButton = styled(base.Button)`
  background-color: ${colors.lightGrayDark};
  flex: 1;
  margin-left: 8px;
`;

const CancelButtonText = styled(base.ButtonText)``;

export default DecksAddScreen;
