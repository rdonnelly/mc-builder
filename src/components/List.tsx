import * as React from 'react';
import styled from 'styled-components/native';

import ListItem from './ListItem';

import { base } from '../styles';

const List: React.FunctionComponent<{
  name: string;
  items: any[];
  count?: number;
  renderItem?: any;
  handlePressItem?: any;
  listRef?: React.MutableRefObject<any>;
}> = ({ name, items, count, renderItem, handlePressItem, listRef }) => {
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
    <Container style={base.container}>
      <FlatList
        ref={listRef}
        renderItem={renderItem != null ? renderItem : defaultRenderItem}
        data={items}
        keyExtractor={(item) => item.code}
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
