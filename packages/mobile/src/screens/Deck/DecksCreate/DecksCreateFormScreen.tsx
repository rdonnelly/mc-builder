import 'react-native-get-random-values';

import { CompositeScreenProps } from '@react-navigation/native';
import { nanoid } from 'nanoid';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled, { useTheme } from 'styled-components/native';

import { DecksCreateContext } from '@context/DecksCreateContext';
import { DecksCreateFormScreenProps } from '@navigation/DecksCreateStackNavigator';
import { DecksCreateScreenProps } from '@navigation/DecksStackNavigator';
import { setUpNewDeck } from '@store/actions';
import { useAppDispatch } from '@store/hooks';

import base from '@mc-builder/shared/src/components/base';
import { getFaction, getSet, SetCodes } from '@mc-builder/shared/src/data';
import { colors } from '@mc-builder/shared/src/styles';

interface DecksCreateFormErrors {
  fields: {
    hero: string;
    aspect: string;
    name: string;
  };
  showErrors: boolean;
}

type DecksCreateFormScreenCompositeProps = CompositeScreenProps<
  DecksCreateFormScreenProps,
  DecksCreateScreenProps
>;

const DecksCreateFormScreen = ({
  navigation,
}: DecksCreateFormScreenCompositeProps) => {
  const { deckName, setDeckName, deckSet, deckAspect } =
    useContext(DecksCreateContext);

  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const theme = useTheme();

  const set = getSet(deckSet);
  const factionNames = deckAspect.map((aspect) => {
    const faction = getFaction(aspect, false);
    return faction.name;
  });

  let requiredAspectCount = 1;
  const aspectCount = deckAspect.length;
  if (deckSet === SetCodes.SPIDER_WOMAN) {
    requiredAspectCount = 2;
  } else if (deckSet === SetCodes.WARLOCK) {
    requiredAspectCount = 0;
  }

  let factionText = factionNames.join(', ');
  if (factionNames?.length <= 0) {
    switch (requiredAspectCount) {
      case 0:
        factionText = 'No Aspect Required';
        break;
      case 1:
        factionText = 'Select an Aspect';
        break;
      case 2:
        factionText = 'Select Two Aspects';
        break;
    }
  }

  const [errors, setErrors] = useState<DecksCreateFormErrors>({
    fields: {
      hero: null,
      aspect: null,
      name: null,
    },
    showErrors: false,
  });

  const validate = useCallback(
    (showErrors = false) => {
      let hasError = false;
      const fieldErrors = {
        hero: null,
        aspect: null,
        name: null,
      };

      if (!deckSet) {
        hasError = true;
        fieldErrors.hero = 'Please choose a hero for your deck';
      }

      if (aspectCount !== requiredAspectCount) {
        hasError = true;
        if (requiredAspectCount === 1) {
          fieldErrors.aspect = 'Please choose an aspect';
        } else if (requiredAspectCount === 2) {
          fieldErrors.aspect = 'Please choose two aspects';
        }
      }

      if (!deckName) {
        hasError = true;
        fieldErrors.name = 'Please provide a name for your deck';
      }

      setErrors({ fields: fieldErrors, showErrors });

      return !hasError;
    },
    [deckSet, deckName, aspectCount, requiredAspectCount, setErrors],
  );

  useEffect(() => {
    validate();
  }, [deckName, deckSet, deckAspect, validate]);

  const submit = useCallback(() => {
    if (!validate(true)) {
      return false;
    }

    const deckCode = nanoid();
    dispatch(setUpNewDeck(deckCode, deckName, deckSet, deckAspect));

    if (navigation) {
      navigation.pop();
      navigation.navigate('DeckDetail', {
        code: deckCode,
      });
    }
  }, [deckName, deckSet, deckAspect, dispatch, navigation, validate]);

  return (
    <Container paddingBottom={insets.bottom}>
      <Form>
        <FormSection>
          <ControlLabel>
            <ControlLabelText>Hero</ControlLabelText>
          </ControlLabel>
          <LinkRowPressable
            onPress={() =>
              navigation.navigate('DecksCreateSelect', { type: 'hero' })
            }
          >
            {({ pressed }) => (
              <LinkRowInner
                hasError={errors.showErrors && errors.fields.hero != null}
                pressed={pressed}
              >
                <LinkRowText active={!!set}>
                  {set ? set.name : 'Select a Hero'}
                </LinkRowText>
                <LinkRowChevronWrapper>
                  <LinkRowChevron size={16} />
                </LinkRowChevronWrapper>
              </LinkRowInner>
            )}
          </LinkRowPressable>
          {errors.showErrors && errors.fields.hero ? (
            <ControlMessage>
              <FontAwesomeIcon
                name="exclamation-circle"
                color={theme.color.typography.error}
                size={16}
                solid
              />
              <ControlMessageText>{errors.fields.hero}</ControlMessageText>
            </ControlMessage>
          ) : null}
        </FormSection>

        <FormSection>
          <ControlLabel>
            <ControlLabelText>Aspect</ControlLabelText>
          </ControlLabel>
          <LinkRowPressable
            disabled={requiredAspectCount <= 0}
            onPress={() =>
              navigation.navigate('DecksCreateSelect', { type: 'aspect' })
            }
          >
            {({ pressed }) => (
              <LinkRowInner
                disabled={requiredAspectCount <= 0}
                hasError={errors.showErrors && errors.fields.aspect != null}
                pressed={pressed}
              >
                <LinkRowText active={!!deckAspect.length}>
                  {factionText}
                </LinkRowText>
                {requiredAspectCount > 0 ? (
                  <LinkRowChevronWrapper>
                    <LinkRowChevron size={16} />
                  </LinkRowChevronWrapper>
                ) : null}
              </LinkRowInner>
            )}
          </LinkRowPressable>
          {errors.showErrors && errors.fields.aspect ? (
            <ControlMessage>
              <FontAwesomeIcon
                name="exclamation-circle"
                color={theme.color.typography.error}
                size={16}
                solid
              />
              <ControlMessageText>{errors.fields.aspect}</ControlMessageText>
            </ControlMessage>
          ) : null}
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
              placeholder={'Enter Deck Name'}
              placeholderTextColor={colors.zinc500}
              returnKeyType={'done'}
              value={deckName}
              onChangeText={(value) => setDeckName(value)}
              hasError={errors.showErrors && errors.fields.name != null}
            />
          </Control>
          {errors.showErrors && errors.fields.name ? (
            <ControlMessage>
              <FontAwesomeIcon
                name="exclamation-circle"
                color={theme.color.typography.error}
                size={16}
                solid
              />
              <ControlMessageText>{errors.fields.name}</ControlMessageText>
            </ControlMessage>
          ) : null}
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
  background-color: ${({ theme }) => theme.color.app.background};
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

const Form = styled.ScrollView`
  flex: 1 1 auto;
  padding-top: 16px;
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
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const ControlMessage = styled.View`
  align-items: center;
  flex-direction: row;
  margin-top: 4px;
  padding-horizontal: 16px;
`;

const ControlMessageText = styled.Text`
  color: ${({ theme }) => theme.color.typography.error};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: 500;
  margin-left: 4px;
`;

const Control = styled.View`
  flex: 1 1 auto;
  padding-horizontal: 16px;
  width: 100%;
`;

const TextInput = styled(base.TextInput)<{ hasError?: boolean }>`
  background-color: ${({ theme }) =>
    theme.theme === 'dark' ? theme.color.input.background : colors.violet50};
  border-color: ${({ hasError, theme }) =>
    hasError ? theme.color.typography.error : 'transparent'};
  border-width: 2px;
  width: 100%;
`;

const LinkRowPressable = styled(Pressable)`
  margin-horizontal: 16px;
`;

const LinkRowInner = styled.View<{
  disabled?: boolean;
  hasError?: boolean;
  pressed: boolean;
}>`
  align-items: center;
  background-color: ${({ disabled, theme }) =>
    disabled
      ? theme.theme === 'dark'
        ? colors.zinc950
        : colors.whiteTranslucent
      : theme.theme === 'dark'
      ? theme.color.input.background
      : colors.violet50};
  border-color: ${({ hasError, theme }) =>
    hasError ? theme.color.typography.error : 'transparent'};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border-width: 2px;
  flex-direction: row;
  justify-content: space-between;
  opacity: ${(props) => (props.pressed ? 0.5 : 1.0)};
  padding: 12px;
`;

const LinkRowText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.zinc600 : colors.zinc500)};
  font-size: ${({ theme }) => theme.fontSize.input};
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
  background-color: ${({ pressed, theme }) =>
    pressed
      ? theme.color.button.success.backgroundActive
      : theme.color.button.success.background};
`;

const AddButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

const CancelButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 0;
  margin-right: 4px;
`;

const CancelButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${({ pressed, theme }) =>
    pressed
      ? theme.color.button.subdued.backgroundActive
      : theme.color.button.subdued.background};
`;

const CancelButtonText = styled(base.ButtonText)<{ pressed?: boolean }>``;

export default DecksCreateFormScreen;
