import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';

import { Deck as DeckModel } from '../data/models/Deck';
import base from './base';

export const ITEM_HEIGHT = 64;

type DecksListItemProps = {
  deck: DeckModel;
  onPressItem: any;
};

const DecksListItem = ({ deck, onPressItem }: DecksListItemProps) => {
  const deckAspectString = deck.aspects?.length
    ? deck.aspectNames.join(', ')
    : '';

  return (
    <ListItemOuter>
      <ListItemPressable onPress={() => onPressItem(deck.code)}>
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            <DeckDetails>
              <DeckDetailsName>
                <DeckDetailsNameText numberOfLines={1}>
                  {deck.name}
                </DeckDetailsNameText>
              </DeckDetailsName>
              <DeckDetailsInfo>
                <DeckDetailsInfoText>
                  <Text>{deck.setName}</Text>
                  {deckAspectString ? <Text>&nbsp;&middot;&nbsp;</Text> : null}
                  {deckAspectString ? <Text>{deckAspectString}</Text> : null}
                </DeckDetailsInfoText>
              </DeckDetailsInfo>
            </DeckDetails>
            <ListChevronWrapper>
              <ListChevron size={16} />
            </ListChevronWrapper>
          </ListItemInner>
        )}
      </ListItemPressable>
    </ListItemOuter>
  );
};

const ListItemOuter = styled(base.Container)`
  background-color: ${({ theme }) => theme.color.list.background};
  border-bottom-color: ${({ theme }) => theme.color.list.border};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  flex-direction: column;
  height: ${ITEM_HEIGHT}px;
  justify-content: center;
`;

const ListItemPressable = styled(Pressable)`
  height: 100%;
  width: 100%;
`;

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
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const DeckDetailsInfo = styled.View`
  flex-direction: row;
`;

const DeckDetailsInfoText = styled.Text`
  color: ${({ theme }) => theme.color.typography.subdued};
  font-size: ${({ theme }) => theme.fontSize.subtext};
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default memo<DecksListItemProps>(DecksListItem);
