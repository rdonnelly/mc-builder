import 'react-native-get-random-values';
import { Platform, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';
import React, { useContext } from 'react';
import styled from 'styled-components/native';

import { DecksCreateContext } from '../../../context/DecksCreateContext';
import { DecksCreateStackParamList } from '../../../navigation/DecksCreateStackNavigator';
import { base, colors } from '../../../styles';
import { getFaction } from '../../../data/models/Faction';
import { getSet } from '../../../data/models/Set';
import { setUpNewDeck } from '../../../store/actions';

const DecksCreateFormScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksCreateStackParamList, 'DecksCreateForm'>;
}> = ({ navigation }) => {
  const { deckName, setDeckName, deckSet, deckAspect } = useContext(
    DecksCreateContext,
  );

  const dispatch = useDispatch();
  const insets = useSafeArea();

  const set = getSet(deckSet, false);
  const faction = getFaction(deckAspect, false);

  const submit = () => {
    const deckCode = uuidv4();
    if (deckName && deckSet && deckAspect) {
      dispatch(setUpNewDeck(deckCode, deckName, deckSet, deckAspect));

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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={insets.top + insets.bottom + 44}
      >
        <Form>
          <FormSection>
            <ControlLabel>
              <ControlLabelText>Deck Name</ControlLabelText>
            </ControlLabel>
            <Control>
              <TextInput
                autoCorrect={false}
                clearButtonMode={'always'}
                editable={true}
                placeholder={'Deck Name'}
                placeholderTextColor={colors.gray}
                returnKeyType={'done'}
                value={deckName}
                onChangeText={(value) => setDeckName(value)}
              />
            </Control>
          </FormSection>

          <FormSection>
            <ControlLabel>
              <ControlLabelText>Select Hero</ControlLabelText>
            </ControlLabel>
            <LinkRow
              onPress={() =>
                navigation.navigate('DecksCreateSelect', { type: 'hero' })
              }
            >
              <LinkRowText active={set}>
                {set ? set.name : 'No Hero Selected'}
              </LinkRowText>
              <LinkRowChevronWrapper>
                <LinkRowChevron name={'chevron-right'} size={16} />
              </LinkRowChevronWrapper>
            </LinkRow>
          </FormSection>

          <FormSection>
            <ControlLabel>
              <ControlLabelText>Select Aspect</ControlLabelText>
            </ControlLabel>
            <LinkRow
              onPress={() =>
                navigation.navigate('DecksCreateSelect', { type: 'aspect' })
              }
            >
              <LinkRowText active={faction}>
                {faction ? faction.name : 'No Aspect Selected'}
              </LinkRowText>
              <LinkRowChevronWrapper>
                <LinkRowChevron name={'chevron-right'} size={16} />
              </LinkRowChevronWrapper>
            </LinkRow>
          </FormSection>
        </Form>

        <Controls>
          <AddButton onPress={submit}>
            <AddButtonText>Create Deck</AddButtonText>
          </AddButton>
          <CancelButton onPress={() => navigation.goBack()}>
            <CancelButtonText>Cancel</CancelButtonText>
          </CancelButton>
        </Controls>
      </KeyboardAvoidingView>
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  background-color: ${colors.lightGray};
  padding-top: 16px;
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

const KeyboardAvoidingView = styled.KeyboardAvoidingView`
  flex: 1 1 auto;
  width: 100%;
`;

const Form = styled.View`
  flex: 1 1 auto;
  width: 100%;
`;

const FormSection = styled.View`
  margin-bottom: 32px;
  width: 100%;
`;

const ControlLabel = styled.View`
  margin-bottom: 4px;
  padding-horizontal: 16px;
`;

const ControlLabelText = styled.Text`
  color: ${colors.grayDark};
  font-size: 16px;
  font-weight: 600;
`;

const Control = styled.View`
  flex: 1 1 auto;
  padding-horizontal: 16px;
  width: 100%;
`;

const TextInput = styled(base.TextInput)`
  width: 100%;
`;

const LinkRow = styled.TouchableOpacity`
  background-color: ${colors.white};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-radius: 8px;
  flex-direction: row;
  justify-content: space-between;
  margin-horizontal: 16px;
  padding-horizontal: 16px;
  padding-vertical: 16px;
`;

const LinkRowText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.darkGray : colors.gray)};
  font-size: 18px;
  font-weight: 600;
`;

const LinkRowChevronWrapper = styled(base.ListChevronWrapper)``;

const LinkRowChevron = styled(base.ListChevron)``;

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

export default DecksCreateFormScreen;
