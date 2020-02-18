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
          contentContainerStyle={{ paddingBottom: 72 }}
          ListFooterComponent={renderFooter}
        />
      ) : (
        renderEmpty()
      )}
      <FloatingControls>
        <FloatingControlsButton
          onPress={() => navigation.navigate('DecksCreate')}
        >
          <FloatingControlsButtonText>Create Deck</FloatingControlsButtonText>
        </FloatingControlsButton>
      </FloatingControls>
    </Container>
  );
};

const Container = styled(base.Container)``;

const FlatList = styled(base.FlatList)``;

const ListFooter = styled(base.ListFooter)``;

const ListFooterText = styled(base.ListFooterText)``;

const FloatingControls = styled.View`
  background-color: rgba(52, 73, 94, 0.1);
  flex-direction: row;
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  border-radius: 4px;
  padding: 8px 4px;
  shadow-color: #000;
  shadow-offset: 1px 3px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
`;

const FloatingControlsButton = styled(base.Button)`
  background-color: ${colors.purple};
  flex: 1 1 auto;
  margin-horizontal: 8px;
  padding: 8px;
`;

const FloatingControlsButtonText = styled(base.ButtonText)``;

export default DecksListScreen;
