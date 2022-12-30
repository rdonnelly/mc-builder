import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import styled from 'styled-components/native';

import { DeckModel } from '../data';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const DecksListItem = ({
  deck,
  onPressItem,
}: {
  deck: DeckModel;
  onPressItem: any;
}) => {
  const deckAspectString = deck.aspects?.length
    ? deck.aspectNames.join(', ')
    : '';

  return (
    <Container>
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
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const DeckDetailsInfo = styled.View`
  flex-direction: row;
`;

const DeckDetailsInfoText = styled.Text`
  color: ${colors.gray};
  font-size: ${({ theme }) => theme.fontSize.subtext};
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default memo(DecksListItem);
