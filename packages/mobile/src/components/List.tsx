import { MutableRefObject } from 'react';
import styled from 'styled-components/native';

import ListItem, { ITEM_HEIGHT } from '@components/ListItem';

import base from '@mc-builder/shared/src/components/base';

const getItemLayout = (_data, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

const List = ({
  name,
  items,
  count,
  renderItem,
  handlePressItem,
  listRef,
}: {
  name: string;
  items: any[];
  count?: number;
  renderItem?: any;
  handlePressItem?: (code: string) => void;
  listRef?: MutableRefObject<any>;
}) => {
  const defaultRenderItem = ({ item }) => (
    <ListItem item={item} handlePressItem={handlePressItem} />
  );

  const renderFooter = () => {
    if (count === 0 || items.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {count || items.length} {name}
          {count === 1 || items.length === 1 ? '' : 's'}
        </ListFooterText>
      </ListFooter>
    );
  };

  return (
    <Container>
      <FlatList
        ref={listRef}
        renderItem={renderItem != null ? renderItem : defaultRenderItem}
        getItemLayout={getItemLayout}
        data={items}
        keyExtractor={(item: any) => item.code}
        ListFooterComponent={renderFooter}
      />
    </Container>
  );
};

const Container = styled(base.Container)``;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default List;
