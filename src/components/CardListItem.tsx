import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import styled from 'styled-components/native';

import { addCardToDeck, removeCardFromDeck } from '../store/actions';
import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

const CardListItem: React.FunctionComponent<{
  card: any;
  count?: number;
  deckCode?: string;
  showPackInfo?: boolean;
  showEditControls?: boolean;
  isSelected: boolean;
  onPressItem: any;
}> = ({
  card,
  count,
  deckCode,
  showPackInfo = true,
  showEditControls,
  onPressItem,
}) => {
  const dispatch = useDispatch();

  const increment = () => dispatch(addCardToDeck(deckCode, card.code));

  const decrement = () => dispatch(removeCardFromDeck(deckCode, card.code));

  const incrementIsDisabled =
    (card.isUnique && count >= 1) ||
    count >= card.deckLimit ||
    card.factionCode === 'hero';
  const decrementIsDisabled = count <= 0 || card.factionCode === 'hero';

  let infoText = `${card.typeName} · ${card.factionName}`;
  if (showPackInfo) {
    infoText = `${card.packName} · ${card.cardCode} · ${infoText}`;
  }

  return (
    <Container>
      <ListItemInner onPress={() => onPressItem(card.code)}>
        {count != null && (
          <CardCount active={count > 0}>
            <CardCountText active={count > 0}>{`x${count}`}</CardCountText>
          </CardCount>
        )}
        <CardDetails>
          <CardDetailsName>
            <CardDetailsNameText numberOfLines={1}>
              {card.name}
            </CardDetailsNameText>
          </CardDetailsName>
          <CardDetailsInfo>
            <CardDetailsInfoText numberOfLines={1}>
              {infoText}
            </CardDetailsInfoText>
          </CardDetailsInfo>
        </CardDetails>
        {showEditControls === true && (
          <CardControls>
            <CardCountDecrementButton
              inactive={decrementIsDisabled}
              onPress={() => decrement()}
            >
              <FontAwesomeIcon
                name="minus"
                color={decrementIsDisabled ? colors.lightGrayDark : colors.red}
                size={16}
                solid
              />
            </CardCountDecrementButton>
            <CardCountIncrementButton
              inactive={incrementIsDisabled}
              onPress={() => increment()}
            >
              <FontAwesomeIcon
                name="plus"
                color={
                  incrementIsDisabled ? colors.lightGrayDark : colors.green
                }
                size={16}
                solid
              />
            </CardCountIncrementButton>
          </CardControls>
        )}
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

const CardControls = styled.View`
  flex-direction: row;
  margin-right: 8px;
`;

const CardCountButton = styled.TouchableOpacity`
  align-items: center;
  background-color: ${colors.white};
  border: 2px solid ${colors.lightGrayDark};
  justify-content: center;
  height: 36px;
  width: 36px;
`;

const CardCountIncrementButton = styled(CardCountButton)<{
  inactive?: boolean;
}>`
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  border-left-width: 1px;
`;

const CardCountDecrementButton = styled(CardCountButton)<{
  inactive?: boolean;
}>`
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  border-right-width: 1px;
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default CardListItem;
