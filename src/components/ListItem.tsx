import React from 'react';
import { StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { base, colors } from '../styles';

export const ITEM_HEIGHT = 48;

const ListItem: React.FunctionComponent<{
  item: { code: string; name: string };
  handlePressItem?: (code: string) => void;
}> = ({ item, handlePressItem }) => {
  return (
    <Container>
      <ListItemInner onPress={() => handlePressItem(item.code)}>
        <ListItemInnerText>{item.name}</ListItemInnerText>
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

const ListItemInnerText = styled.Text`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default ListItem;
