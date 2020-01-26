import React, { useRef } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import styled from 'styled-components/native';

import { DecksStackParamList } from '../navigation/DecksStackNavigator';
import DecksListItem from '../components/DecksListItem';
import { StoreState } from '../store';
import { IDeck } from '../store/types';

import { base } from '../styles';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const decks = useSelector((state: StoreState) => state.decks);

  const flatListRef = useRef(null);
  useScrollToTop(flatListRef);

  navigation.setOptions({
    headerRight: () => {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DecksAdd')}>
          <Text>Add Deck</Text>
        </TouchableOpacity>
      );
    },
  });

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckDetail', {
        code,
      });
    }
  };

  const renderCard = ({ item: deck }: { item: IDeck }) => (
    <DecksListItem deck={deck} onPressItem={handlePressItem} />
  );

  const renderFooter = () => {
    if (decks.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {decks.length} Deck
          {decks.length === 1 ? '' : 's'}
        </ListFooterText>
      </ListFooter>
    );
  };

  const renderEmpty = () => {
    return (
      <ListFooter>
        <ListFooterText>No Decks Found</ListFooterText>
      </ListFooter>
    );
  };

  return (
    <Container>
      {decks.length > 0 ? (
        <FlatList
          ref={flatListRef}
          renderItem={renderCard}
          data={decks}
          keyExtractor={(card: IDeck) => card.code}
          ListFooterComponent={renderFooter}
        />
      ) : (
        renderEmpty()
      )}
    </Container>
  );
};

const Container = styled(base.Container)``;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

export default DecksListScreen;
