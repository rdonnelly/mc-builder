import { Pressable, StyleSheet, Text } from 'react-native';
import React from 'react';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { IDeck } from '../store/types';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const DecksListItem: React.FunctionComponent<{
  deck: IDeck;
  onPressItem: any;
}> = ({ deck, onPressItem }) => {
  const deckModel = new DeckModel(deck);
  return (
    <Container>
      <ListItemPressable onPress={() => onPressItem(deckModel.code)}>
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            <DeckDetails>
              <DeckDetailsName>
                <DeckDetailsNameText numberOfLines={1}>
                  {deckModel.name}
                </DeckDetailsNameText>
              </DeckDetailsName>
              <DeckDetailsInfo>
                <DeckDetailsInfoText>
                  <Text>{deckModel.setName}</Text>
                  <Text>&nbsp;&middot;&nbsp;</Text>
                  <Text>{deckModel.aspectNames.join(' + ')}</Text>
                </DeckDetailsInfoText>
              </DeckDetailsInfo>
            </DeckDetails>
            <ListChevronWrapper>
              <ListChevron name={'chevron-right'} size={16} />
            </ListChevronWrapper>
          </ListItemInner>
        )}
      </ListItemPressable>
    </Container>
  );
};

const Container = styled(base.Container)`
  background-color: ${colors.lightGray};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: column;
  height: ${ITEM_HEIGHT}px;
  justify-content: center;
`;

const ListItemPressable = styled(Pressable)``;

const ListItemInner = styled.View<{ pressed: boolean }>`
  align-items: center;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  opacity: ${(props) => (props.pressed ? 0.4 : 1.0)};
  padding-horizontal: 16px;
  width: 100%;
`;

const DeckDetails = styled.View`
  align-items: flex-start;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
`;

const DeckDetailsName = styled.View`
  padding-bottom: 2px;
`;

const DeckDetailsNameText = styled.Text`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const DeckDetailsInfo = styled.View`
  flex-direction: row;
`;

const DeckDetailsInfoText = styled.Text`
  color: ${colors.gray};
  font-size: 13px;
  font-weight: 500;
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default DecksListItem;
