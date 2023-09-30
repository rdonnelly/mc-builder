import { memo } from 'react';
import { StyleSheet } from 'react-native';
import NativeView from 'react-native/Libraries/Components/View/ViewNativeComponent';
import { NativeText } from 'react-native/Libraries/Text/TextNativeComponent';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import { TypeCodes } from '../data';
import { Card as CardModel } from '../data/models/Card';
import { colors } from '../styles';
import { getCardColor } from '../styles/utils';
import base from './base';
import CardResourceIcons from './CardResourceIcons';

export const ITEM_HEIGHT = 64;

const getFactionOrSetText = (card: CardModel) => {
  const text = card.setName != null ? card.setName : card.factionName;
  const color = getCardColor(card);

  return (
    <CardDetailsInfoFactionOrSet color={color}>
      {text}
    </CardDetailsInfoFactionOrSet>
  );
};

type CardListItemProps = {
  card: CardModel;
  index: number;
  count?: number;
  deckCode?: string;
  onPressItem?: (cardCode: string, index: number) => void;
  showEditControls?: boolean;
  showPackInfo?: boolean;
  increment?: (card: CardModel, quantity: number) => void;
  incrementIsDisabled?: (card: CardModel, quantity: number) => boolean;
  decrement?: (card: CardModel, quantity: number) => void;
  decrementIsDisabled?: (card: CardModel, quantity: number) => boolean;
};

const CardListItem = ({
  card,
  index,
  count,
  onPressItem,
  showPackInfo = true,
  showEditControls,
  increment,
  incrementIsDisabled,
  decrement,
  decrementIsDisabled,
}: CardListItemProps) => {
  let infoText = '';

  if (card.typeCode === TypeCodes.VILLAIN && card.stage != null) {
    infoText = ` · ${card.typeName} · Stage ${card.stage}`;
  } else if (card.cost != null) {
    infoText = ` · ${card.typeName} · ${card.cost}`;
  } else {
    infoText = ` · ${card.typeName}`;
  }

  const resourceIcons = (
    <>
      {card.resources != null ? (
        <NativeText key={'resource_icon_separator'}> · </NativeText>
      ) : null}
      <CardResourceIcons card={card} />
    </>
  );

  let packText = '';
  if (showPackInfo) {
    packText = ` · ${card.packCode.toUpperCase()} · ${card.cardCode}`;
  }

  return (
    <ListItemOuter>
      <ListItemPressable
        disabled={onPressItem == null}
        onPress={() => onPressItem != null && onPressItem(card.code, index)}
      >
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            {count != null ? (
              <CardCount active={count > 0}>
                <CardCountText active={count > 0}>{`x${count}`}</CardCountText>
              </CardCount>
            ) : null}
            <CardDetails>
              <CardDetailsName>
                <CardDetailsNameText numberOfLines={1}>
                  {card.name}
                </CardDetailsNameText>
              </CardDetailsName>
              <CardDetailsInfo>
                <CardDetailsInfoText numberOfLines={1}>
                  {getFactionOrSetText(card)}
                  {infoText}
                  {resourceIcons}
                  {packText}
                </CardDetailsInfoText>
              </CardDetailsInfo>
            </CardDetails>
            {showEditControls === true ? (
              <CardControls>
                <CardCountIncrementButton
                  onPress={() => increment(card, count)}
                  active={!incrementIsDisabled(card, count)}
                >
                  {({ pressed: cardControlPressed }) => (
                    <CardCountIncrementButtonBackground
                      active={
                        cardControlPressed && !incrementIsDisabled(card, count)
                      }
                    >
                      <FontAwesomeIcon
                        name="plus"
                        color={
                          incrementIsDisabled(card, count)
                            ? colors.lightGrayDark
                            : cardControlPressed
                            ? colors.greenDark
                            : colors.green
                        }
                        size={16}
                        solid
                      />
                    </CardCountIncrementButtonBackground>
                  )}
                </CardCountIncrementButton>
                <CardCountDecrementButton
                  onPress={() => decrement(card, count)}
                  active={!decrementIsDisabled(card, count)}
                >
                  {({ pressed: cardControlPressed }) => (
                    <CardCountDecrementButtonBackground
                      active={
                        cardControlPressed && !decrementIsDisabled(card, count)
                      }
                    >
                      <FontAwesomeIcon
                        name="minus"
                        color={
                          decrementIsDisabled(card, count)
                            ? colors.lightGrayDark
                            : cardControlPressed
                            ? colors.redDark
                            : colors.red
                        }
                        size={16}
                        solid
                      />
                    </CardCountDecrementButtonBackground>
                  )}
                </CardCountDecrementButton>
              </CardControls>
            ) : null}
            {onPressItem != null ? (
              <ListChevronWrapper>
                <ListChevron />
              </ListChevronWrapper>
            ) : null}
          </ListItemInner>
        )}
      </ListItemPressable>
    </ListItemOuter>
  );
};

const ListItemOuter = styled(NativeView)`
  background-color: ${colors.lightGray};
  border-bottom-color: ${colors.lightGrayDark};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  height: ${ITEM_HEIGHT}px;
  justify-content: center;

  align-items: center;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const ListItemPressable = styled.Pressable`
  flex: 1 1 auto;
  width: 100%;
`;

const ListItemInner = styled(NativeView)<{ pressed: boolean }>`
  align-items: center;
  flex-direction: row;
  flex: 1 1 auto;
  justify-content: space-between;
  opacity: ${(props) => (props.pressed ? 0.4 : 1.0)};
  padding-horizontal: 16px;
  width: 100%;
`;

const CardCount = styled(NativeView)<{ active?: boolean }>`
  align-items: center;
  background-color: ${(props) =>
    props.active ? colors.white : colors.lightGray};
  border: ${StyleSheet.hairlineWidth}px solid
    ${(props) => (props.active ? colors.lightGrayDark : colors.lightGrayDark)};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  height: 36px;
  justify-content: center;
  margin-right: 8px;
  width: 36px;
`;

const CardCountText = styled(NativeText)<{ active?: boolean }>`
  color: ${(props) => (props.active ? colors.blue : colors.lightGrayDark)};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.black};
`;

const CardDetails = styled(NativeView)`
  align-items: flex-start;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  margin-right: 8px;
`;

const CardDetailsName = styled(NativeView)`
  padding-bottom: 2px;
`;

const CardDetailsNameText = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const CardDetailsInfo = styled(NativeView)`
  flex-direction: row;
`;

const CardDetailsInfoText = styled.Text`
  color: ${colors.grayDark};
  font-size: ${({ theme }) => theme.fontSize.subtext};
`;

const CardDetailsInfoFactionOrSet = styled(NativeText)<{
  color?: string;
}>`
  color: ${(props) => (props.color ? props.color : colors.grayDark)};
  font-size: ${({ theme }) => theme.fontSize.subtext};
`;

const CardControls = styled(NativeView)`
  flex-direction: row;
  margin-right: 8px;
`;

const CardCountButton = styled.Pressable<{
  active: boolean;
}>`
  align-items: center;
  background-color: ${(props) =>
    props.active ? colors.white : colors.lightGray};
  border: ${StyleSheet.hairlineWidth}px solid ${colors.lightGrayDark};
  justify-content: center;
  height: 36px;
  width: 36px;
`;

const CardCountButtonBackground = styled(NativeView)<{
  active: boolean;
}>`
  align-items: center;
  background-color: ${(props) =>
    props.active ? colors.lightGray : 'transparent'};
  flex: 1 1 auto;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const CardCountIncrementButton = styled(CardCountButton)<{
  active: boolean;
}>`
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-right-width: ${StyleSheet.hairlineWidth}px;
`;

const CardCountIncrementButtonBackground = styled(CardCountButtonBackground)<{
  active: boolean;
}>`
  background-color: ${(props) => (props.active ? colors.green : 'transparent')};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.sm};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const CardCountDecrementButton = styled(CardCountButton)<{
  active: boolean;
}>`
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
`;

const CardCountDecrementButtonBackground = styled(CardCountButtonBackground)<{
  active: boolean;
}>`
  background-color: ${(props) => (props.active ? colors.red : 'transparent')};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.sm};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = base.ListChevron;

export default memo<CardListItemProps>(CardListItem);
