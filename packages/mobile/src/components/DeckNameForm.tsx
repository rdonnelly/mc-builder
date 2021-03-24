import 'react-native-get-random-values';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';

import { base, colors } from '@styles';

const DecksCreateFormScreen: React.FunctionComponent<{
  name: string;
  submit: (deckName: string) => void;
  submitLabel: string;
  cancel: () => void;
}> = ({ name, submit, submitLabel, cancel }) => {
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
              placeholderTextColor={colors.gray}
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
  background-color: ${colors.lightGray};
  padding-top: 16px;
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
