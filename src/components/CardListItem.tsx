import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import styled from 'styled-components/native';

import { base, colors } from '../styles';

export const ITEM_HEIGHT = 64;

// const CardListItem: React.FunctionComponent<{
//   card: any;
//   isSelected: boolean;
//   onPressItem: any;
// }> = ({ card, onPressItem }) => {
//   return (
//     <View>
//       <Text numberOfLines={1}>{card.name}</Text>
//     </View>
//   );
// };

const CardListItem: React.FunctionComponent<{
  card: any;
  isSelected: boolean;
  onPressItem: any;
}> = ({ card, onPressItem }) => {
  return (
    <Container>
      <ListItemInner onPress={() => onPressItem(card.code)}>
        <CardDetails>
          <CardDetailsName>
            <CardDetailsNameText numberOfLines={1}>
              {card.name}
            </CardDetailsNameText>
          </CardDetailsName>
          <CardDetailsInfo>
            <CardDetailsInfoText>
              <Text>{card.typeName}</Text>
              <Text>&nbsp;&middot;&nbsp;</Text>
              <Text>{card.packName}</Text>
              <Text>&nbsp;&middot;&nbsp;</Text>
              <Text>{card.cardCode}</Text>
            </CardDetailsInfoText>
          </CardDetailsInfo>
        </CardDetails>
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

const CardDetails = styled.View`
  align-items: flex-start;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
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

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default CardListItem;
