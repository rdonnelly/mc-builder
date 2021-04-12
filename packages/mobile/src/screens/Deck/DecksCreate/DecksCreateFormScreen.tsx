import 'react-native-get-random-values';

import { StackNavigationProp } from '@react-navigation/stack';
import { nanoid } from 'nanoid';
import React, { useContext } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { DecksCreateContext } from '@context/DecksCreateContext';
import { DecksCreateStackParamList } from '@navigation/DecksCreateStackNavigator';
import { setUpNewDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import { getFaction, getSet } from '@shared/data';
import { base, colors } from '@shared/styles';

const DecksCreateFormScreen = ({
  navigation,
}: {
  navigation: StackNavigationProp<DecksCreateStackParamList, 'DecksCreateForm'>;
}) => {
  const { deckName, setDeckName, deckSet, deckAspect } = useContext(
    DecksCreateContext,
  );

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const set = getSet(deckSet, false);
  const factionNames = deckAspect.map((aspect) => {
    const faction = getFaction(aspect, false);
    return faction.name;
  });
  const factionText = factionNames.length
    ? factionNames.join(' + ')
    : 'No Aspect Selected';

  const submit = () => {
    const deckCode = nanoid();
    if (deckName && deckSet && deckAspect.length) {
      dispatch(setUpNewDeck(deckCode, deckName, deckSet, deckAspect));

      if (navigation) {
        navigation.pop();
        // @ts-ignore
        navigation.navigate('DeckDetail', {
          code: deckCode,
        });
      }
    }
  };

  return (
    <Container paddingBottom={insets.bottom}>
      <Form>
        <FormSection>
          <ControlLabel>
            <ControlLabelText>Select Hero</ControlLabelText>
          </ControlLabel>
          <LinkRowPressable
            onPress={() =>
              navigation.navigate('DecksCreateSelect', { type: 'hero' })
            }
          >
            {({ pressed }) => (
              <LinkRowInner pressed={pressed}>
                <LinkRowText active={set}>
                  {set ? set.name : 'No Hero Selected'}
                </LinkRowText>
                <LinkRowChevronWrapper>
                  <LinkRowChevron name={'chevron-right'} size={16} />
                </LinkRowChevronWrapper>
              </LinkRowInner>
            )}
          </LinkRowPressable>
        </FormSection>

        <FormSection>
          <ControlLabel>
            <ControlLabelText>Select Aspect</ControlLabelText>
          </ControlLabel>
          <LinkRowPressable
            onPress={() =>
              navigation.navigate('DecksCreateSelect', { type: 'aspect' })
            }
          >
            {({ pressed }) => (
              <LinkRowInner pressed={pressed}>
                <LinkRowText active={!!deckAspect.length}>
                  {factionText}
                </LinkRowText>
                <LinkRowChevronWrapper>
                  <LinkRowChevron name={'chevron-right'} size={16} />
                </LinkRowChevronWrapper>
              </LinkRowInner>
            )}
          </LinkRowPressable>
        </FormSection>

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
      </Form>

      <Controls>
        <CancelButtonWrapper onPress={() => navigation.goBack()}>
          {({ pressed }) => (
            <CancelButton pressed={pressed}>
              <CancelButtonText pressed={pressed}>Cancel</CancelButtonText>
            </CancelButton>
          )}
        </CancelButtonWrapper>
        <AddButtonWrapper onPress={submit}>
          {({ pressed }) => (
            <AddButton pressed={pressed}>
              <AddButtonText pressed={pressed}>Create Deck</AddButtonText>
            </AddButton>
          )}
        </AddButtonWrapper>
      </Controls>
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  background-color: ${colors.lightGray};
  padding-top: 16px;
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

const Form = styled.ScrollView`
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
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Control = styled.View`
  flex: 1 1 auto;
  padding-horizontal: 16px;
  width: 100%;
`;

const TextInput = styled(base.TextInput)`
  width: 100%;
`;

const LinkRowPressable = styled(Pressable)``;

const LinkRowInner = styled.View<{ pressed: boolean }>`
  background-color: ${colors.white};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  flex-direction: row;
  justify-content: space-between;
  opacity: ${(props) => (props.pressed ? 0.5 : 1.0)};
  margin-horizontal: 16px;
  padding: 16px;
`;

const LinkRowText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.darkGray : colors.gray)};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const LinkRowChevronWrapper = styled(base.ListChevronWrapper)``;

const LinkRowChevron = styled(base.ListChevron)``;

const Controls = styled.View`
  flex-direction: row;
  padding-horizontal: 16px;
`;

const AddButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 auto;
  margin-left: 4px;
`;

const AddButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.greenDark : colors.green};
`;

const AddButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

const CancelButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 0;
  margin-right: 4px;
`;

const CancelButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.grayDark : colors.gray};
`;

const CancelButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

export default DecksCreateFormScreen;
