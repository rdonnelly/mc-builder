import { ListRenderItem } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useEffect } from 'react';
import styled from 'styled-components/native';

import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import DecksListItem from '../../components/DecksListItem';

import { base, colors } from '../../styles';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const deckCodes = useSelector((state: StoreState) => state.decks.codes);
  const deckEntities = useSelector((state: StoreState) => state.decks.entities);

  useEffect(() => {
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
  }, [navigation]);

  const handlePressItem = (code: string) => {
    if (navigation) {
      navigation.navigate('DeckDetail', {
        code,
      });
    }
  };

  const renderCard: ListRenderItem<string> = ({ item: deckCode }) => (
    <DecksListItem
      deck={deckEntities[deckCode]}
      onPressItem={handlePressItem}
    />
  );

  const renderFooter = () => {
    if (deckCodes.length === 0) {
      return null;
    }

    return (
      <ListFooter>
        <ListFooterText>
          Showing {deckCodes.length} Deck
          {deckCodes.length === 1 ? '' : 's'}
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
      {deckCodes.length > 0 ? (
        <FlatList
          renderItem={renderCard}
          data={deckCodes}
          keyExtractor={(code: string) => code}
          contentContainerStyle={{ paddingBottom: 72 }}
          ListFooterComponent={renderFooter}
        />
      ) : (
        renderEmpty()
      )}
      <FloatingControls>
        <FloatingControlsButtonWrapper
          onPress={() => navigation.navigate('DecksCreate')}
        >
          {({ pressed }) => (
            <FloatingControlsButton pressed={pressed}>
              <FloatingControlsButtonText pressed={pressed}>
                Create Deck
              </FloatingControlsButtonText>
            </FloatingControlsButton>
          )}
        </FloatingControlsButtonWrapper>
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
`;

const FloatingControlsButtonWrapper = styled(base.ButtonWrapper)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlsButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.purpleDark : colors.purple};
`;

const FloatingControlsButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

export default DecksListScreen;
