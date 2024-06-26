import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import base from '@mc-builder/shared/src/components/base';
import { colors } from '@mc-builder/shared/src/styles';

const DecksCreateFormScreen = ({
  name,
  submit,
  submitLabel,
  cancel,
}: {
  name: string;
  submit: (deckName: string) => void;
  submitLabel: string;
  cancel: () => void;
}) => {
  const [deckName, setDeckName] = useState(name);

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const submitForm = () => {
    submit(deckName);
  };

  const cancelForm = () => {
    cancel();
  };

  return (
    <Container>
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
              placeholderTextColor={colors.zinc400}
              returnKeyType={'done'}
              ref={inputRef}
              value={deckName}
              onChangeText={(value) => setDeckName(value)}
            />
          </Control>
        </FormSection>
      </Form>

      <Controls>
        <CancelButtonWrapper onPress={cancelForm}>
          {({ pressed }) => (
            <CancelButton pressed={pressed}>
              <CancelButtonText pressed={pressed}>Cancel</CancelButtonText>
            </CancelButton>
          )}
        </CancelButtonWrapper>
        <AddButtonWrapper onPress={submitForm}>
          {({ pressed }) => (
            <AddButton pressed={pressed}>
              <AddButtonText pressed={pressed}>
                {submitLabel || 'Submit'}
              </AddButtonText>
            </AddButton>
          )}
        </AddButtonWrapper>
      </Controls>
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${({ theme }) => theme.color.app.background};
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

const Control = styled.View`
  flex: 1 1 auto;
  padding-horizontal: 16px;
  width: 100%;
`;

const TextInput = styled(base.TextInput)`
  width: 100%;
`;

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
