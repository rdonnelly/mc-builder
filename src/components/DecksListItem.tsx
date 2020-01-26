import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';

import { IDeck } from '../store/types';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const DecksListItem: React.FunctionComponent<{
  deck: IDeck;
  onPressItem: any;
}> = ({ deck, onPressItem }) => {
  return (
    <Container>
      <ListItemInner onPress={() => onPressItem(deck.code)}>
        <DeckDetails>
          <DeckDetailsName>
            <DeckDetailsNameText numberOfLines={1}>
              {deck.name}
            </DeckDetailsNameText>
          </DeckDetailsName>
          <DeckDetailsInfo>
            <DeckDetailsInfoText>
              <Text>{deck.setCode}</Text>
              <Text>&nbsp;&middot;&nbsp;</Text>
              <Text>{deck.aspectCode}</Text>
            </DeckDetailsInfoText>
          </DeckDetailsInfo>
        </DeckDetails>
        <ListChevronWrapper>
          <ListChevron name={'chevron-right'} size={16} />
        </ListChevronWrapper>
      </ListItemInner>
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

const ListItemInner = styled.TouchableOpacity`
  align-items: center;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
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
