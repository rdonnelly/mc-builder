import React, { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import { useDispatch } from 'react-redux';
import styled from 'styled-components/native';

import Icon, { IconCode } from '@components/Icon';
import { CardModel, FactionCodes, TypeCodes } from '@data';
import { addCardToDeck, removeCardFromDeck } from '@store/actions';
import { base, colors } from '@styles';

export const ITEM_HEIGHT = 64;

const getFactionOrSetText = (card: CardModel) => {
  const text = card.setName != null ? card.setName : card.factionName;
  const color =
    card.setName == null
      ? colors.factions[`${card.factionCode}Dark`]
      : card.typeCode === TypeCodes.VILLAIN
      ? colors.purple
      : card.factionCode === FactionCodes.ENCOUNTER
      ? colors.orange
      : colors.grayDark;

  return (
    <CardDetailsInfoFactionOrSet color={color}>
      {text}
    </CardDetailsInfoFactionOrSet>
  );
};

const getResourceIcons = (card: CardModel) => {
  const resources = card.resources;
  if (resources == null) {
    return null;
  }

  return Object.keys(resources).reduce(
    (icons, resourceKey) => {
      if (!resources[resourceKey]) {
        return icons;
      }

      icons.push(
        ...Array(resources[resourceKey])
          .fill('')
          .map((_val, i) => (
            <Icon
              code={IconCode[resourceKey]}
              color={colors.icons[resourceKey]}
              key={`resource_icon_${i}`}
            />
          )),
      );

      return icons;
    },
    [<Text key={'resource_icon_separator'}> · </Text>],
  );
};

const CardListItem = ({
  card,
  count,
  deckCode,
  onPressItem,
  showEditControls,
  showPackInfo = true,
}: {
  card: CardModel;
  count?: number;
  deckCode?: string;
  onPressItem?: (code: string) => void;
  showEditControls?: boolean;
  showPackInfo?: boolean;
}) => {
  const dispatch = useDispatch();

  const incrementIsDisabled =
    (card.isUnique && count >= 1) ||
    count >= card.deckLimit ||
    (card.setCode != null && count >= card.setQuantity);
  const decrementIsDisabled =
    count <= 0 || (card.setCode != null && count <= card.setQuantity);

  const increment = () => {
    if (!incrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(addCardToDeck(deckCode, card));
    }
  };

  const decrement = () => {
    if (!decrementIsDisabled) {
      ReactNativeHapticFeedback.trigger('selection');
      dispatch(removeCardFromDeck(deckCode, card));
    }
  };

  let infoText = '';

  if (card.typeCode === TypeCodes.VILLAIN && card.raw.stage != null) {
    infoText = `${infoText} · ${card.typeName} · Stage ${card.raw.stage}`;
  } else if (card.cost != null) {
    infoText = `${infoText} · ${card.typeName} · ${card.cost}`;
  } else {
    infoText = `${infoText} · ${card.typeName}`;
  }

  let packText = '';

  if (showPackInfo) {
    packText = ` · ${card.packCode.toUpperCase()} · ${card.cardCode}`;
  }

  return (
    <ListItemOuter>
      <ListItemPressable
        disabled={onPressItem == null}
        onPress={() => onPressItem != null && onPressItem(card.code)}
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
                  {getResourceIcons(card)}
                  {packText}
                </CardDetailsInfoText>
              </CardDetailsInfo>
            </CardDetails>
            {showEditControls === true ? (
              <CardControls>
                <CardCountIncrementButton
                  onPress={() => increment()}
                  active={!incrementIsDisabled}
                >
                  {({ pressed: cardControlPressed }) => (
                    <CardCountIncrementButtonBackground
                      active={cardControlPressed && !incrementIsDisabled}
                    >
                      <FontAwesomeIcon
                        name="plus"
                        color={
                          incrementIsDisabled
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
                  onPress={() => decrement()}
                  active={!decrementIsDisabled}
                >
                  {({ pressed: cardControlPressed }) => (
                    <CardCountDecrementButtonBackground
                      active={cardControlPressed && !decrementIsDisabled}
                    >
                      <FontAwesomeIcon
                        name="minus"
                        color={
                          decrementIsDisabled
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
                <ListChevron size={16} />
              </ListChevronWrapper>
            ) : null}
          </ListItemInner>
        )}
      </ListItemPressable>
    </ListItemOuter>
  );
};

const ListItemOuter = styled(base.Container)`
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
  flex-direction: row;
  flex: 1 1 auto;
  justify-content: space-between;
  opacity: ${(props) => (props.pressed ? 0.4 : 1.0)};
  padding-horizontal: 16px;
  width: 100%;
`;

const CardCount = styled.View<{ active?: boolean }>`
  background-color: ${(props) =>
    props.active ? colors.white : colors.lightGray};
  align-items: center;
  border: 2px solid
    ${(props) => (props.active ? colors.lightGrayDark : colors.lightGrayDark)};
  border-radius: 8px;
  height: 36px;
  justify-content: center;
  margin-right: 8px;
  width: 36px;
`;

const CardCountText = styled.Text<{ active?: boolean }>`
  color: ${(props) => (props.active ? colors.blue : colors.lightGrayDark)};
  font-size: 16px;
  font-weight: 800;
`;

const CardDetails = styled.View`
  align-items: flex-start;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
  margin-right: 8px;
`;

const CardDetailsName = styled.View`
  padding-bottom: 2px;
`;

const CardDetailsNameText = styled.Text`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const CardDetailsInfo = styled.View`
  flex-direction: row;
`;

const CardDetailsInfoText = styled.Text`
  color: ${colors.gray};
  font-size: 13px;
  font-weight: 500;
`;

const CardDetailsInfoFactionOrSet = styled.Text<{
  color?: string;
}>`
  color: ${(props) => (props.color ? props.color : colors.gray)};
  font-size: 13px;
  font-weight: 500;
`;

const CardControls = styled.View`
  flex-direction: row;
  margin-right: 8px;
`;

const CardCountButton = styled(Pressable)<{
  active: boolean;
}>`
  align-items: center;
  background-color: ${(props) =>
    props.active ? colors.white : colors.lightGray};
  border: 2px solid ${colors.lightGrayDark};
  justify-content: center;
  height: 36px;
  width: 36px;
`;

const CardCountButtonBackground = styled.View<{
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
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-right-width: 1px;
`;

const CardCountIncrementButtonBackground = styled(CardCountButtonBackground)<{
  active: boolean;
}>`
  background-color: ${(props) => (props.active ? colors.green : 'transparent')};
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
`;

const CardCountDecrementButton = styled(CardCountButton)<{
  active: boolean;
}>`
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-left-width: 1px;
`;

const CardCountDecrementButtonBackground = styled(CardCountButtonBackground)<{
  active: boolean;
}>`
  background-color: ${(props) => (props.active ? colors.red : 'transparent')};
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default memo(CardListItem);
