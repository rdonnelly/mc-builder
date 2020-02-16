import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React from 'react';
import styled from 'styled-components/native';

import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { IDeck } from '../../store/types';
import { StoreState } from '../../store';
import DecksListItem from '../../components/DecksListItem';

import { base, colors } from '../../styles';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const decks = useSelector((state: StoreState) => state.decks);

  navigation.setOptions({
    headerRight: () => {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('DecksCreate')}>
          <FontAwesomeIcon
            name="layer-plus"
            color={colors.white}
            size={24}
            solid
          />
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
