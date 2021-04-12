import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { base, colors } from '@shared/styles';

export const ITEM_HEIGHT = 48;

const ListItem = ({
  item,
  handlePressItem,
}: {
  item: { code: string; name: string };
  handlePressItem?: (code: string) => void;
}) => {
  return (
    <Container>
      <ListItemPressable onPress={() => handlePressItem(item.code)}>
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            <ListItemInnerText>{item.name}</ListItemInnerText>
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

const ListItemInnerText = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default memo(ListItem);
