import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import base from '@mc-builder/shared/src/components/base';

export const ITEM_HEIGHT = 64;

type ListItemProps = {
  item: { code: string; name: string; description: string };
  handlePressItem?: (code: string) => void;
};

const ListItem = ({ item, handlePressItem }: ListItemProps) => {
  return (
    <Container>
      <ListItemPressable onPress={() => handlePressItem(item.code)}>
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            <ListItemInnerText>
              <ListItemInnerTextTitle>{item.name}</ListItemInnerTextTitle>
              {item.description ? (
                <ListItemInnerTextSubtitle>
                  {item.description}
                </ListItemInnerTextSubtitle>
              ) : null}
            </ListItemInnerText>
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

const ListItemInnerText = styled.View``;

const ListItemInnerTextTitle = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.list};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const ListItemInnerTextSubtitle = styled.Text`
  color: ${({ theme }) => theme.color.typography.subdued};
  font-size: ${({ theme }) => theme.fontSize.subtext};
`;

const ListChevronWrapper = styled(base.ListChevronWrapper)``;

const ListChevron = styled(base.ListChevron)``;

export default memo<ListItemProps>(ListItem);
