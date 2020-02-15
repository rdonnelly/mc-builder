import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import uuidv4 from 'uuid/v4';

import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { addDeck } from '../../store/reducers/decks';
import { base, colors } from '../../styles';
import { getHeroSets } from '../../data/models/Set';
import { getPrimaryFactions } from '../../data/models/Faction';

const DecksAddScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const [deckName, handleDeckNameChange] = useState('');
  const [deckSet, handleDeckSetChange] = useState('');
  const [deckAspect, handleDeckAspectChange] = useState('');
  const dispatch = useDispatch();

  const sets = getHeroSets();
  const aspects = getPrimaryFactions();

  const insets = useSafeArea();

  const submit = () => {
    const deckCode = uuidv4();
    if (deckName && deckSet && deckAspect) {
      dispatch(
        addDeck({
          code: deckCode,
          name: deckName,
          setCode: deckSet,
          aspectCode: deckAspect,
        }),
      );

      if (navigation) {
        navigation.goBack();
        navigation.navigate('DeckDetail', {
          code: deckCode,
        });
      }
    }
  };

  return (
    <Container paddingBottom={insets.bottom}>
      <Header>
        <HeaderTitle>Add Deck</HeaderTitle>
      </Header>
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
          <Picker.Item label={'Select a Hero'} value={''} key={'deafult'} />
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
          <Picker.Item label={'Select an Aspect'} value={''} key={'deafult'} />
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
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

// https://github.com/react-navigation/react-navigation/blob/cea2fc29baae7c5bf3b867fc6bc5911fb8161cf8/packages/stack/src/views/Header/HeaderSegment.tsx
const Header = styled.View`
  background-color: ${colors.purple};
  height: 52px;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  width: 100%;
`;

// https://github.com/react-navigation/react-navigation/blob/cea2fc29baae7c5bf3b867fc6bc5911fb8161cf8/packages/stack/src/views/Header/HeaderTitle.tsx
const HeaderTitle = styled.Text`
  color: ${colors.white};
  font-size: 17px;
  font-weight: 600;
`;

const Form = styled.View`
  flex: 1 1 auto;
  padding-horizontal: 16px;
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
  padding-horizontal: 16px;
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
