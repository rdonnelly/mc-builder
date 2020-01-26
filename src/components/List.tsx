import * as React from 'react';
import styled from 'styled-components/native';

import ListItem from './ListItem';

import { base } from '../styles';

const List: React.FunctionComponent<{
  name: string;
  items: any[];
  handlePressItem: any;
  listRef?: React.MutableRefObject<any>;
}> = ({ name, items, handlePressItem, listRef }) => {
  const renderItem = ({ item }) => (
    <ListItem item={item} handlePressItem={handlePressItem} />
  );

  const renderFooter = () => {
    if (items.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {items.length} {name}
          {items.length === 1 ? '' : 's'}
        </ListFooterText>
      </ListFooter>
    );
  };

  return (
    <Container style={base.container}>
      <FlatList
        ref={listRef}
        renderItem={renderItem}
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
