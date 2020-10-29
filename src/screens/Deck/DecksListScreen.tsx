import { Alert, ListRenderItem } from 'react-native';
import { Pressable } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSelector } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';
import React, { useEffect } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { DecksStackParamList } from '../../navigation/DecksStackNavigator';
import { StoreState } from '../../store';
import { getClipboard } from '../../utils/Clipboard';
import { validateDeckJson } from '../../utils/DeckParser';
import DecksListItem from '../../components/DecksListItem';

import { base, colors } from '../../styles';

const DecksListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<DecksStackParamList, 'DecksList'>;
}> = ({ navigation }) => {
  const deckCodes = useSelector((state: StoreState) => state.decks.codes);
  const deckEntities = useSelector((state: StoreState) => state.decks.entities);

  const { showActionSheetWithOptions } = useActionSheet();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Pressable onPress={() => navigation.navigate('DecksCreate')}>
            {({ pressed }) => (
              <FontAwesomeIcon
                name="layer-plus"
                color={pressed ? colors.purpleDark : colors.white}
                size={24}
                solid
              />
            )}
          </Pressable>
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

  const handleMenuOpen = () => {
    ReactNativeHapticFeedback.trigger('impactLight');
    showActionSheetWithOptions(
      {
        options: ['Close', 'Import From Clipboard'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1: {
            handleImportDeck();
            break;
          }
        }
      },
    );
  };

  const handleImportDeck = async () => {
    const clipboardContent = await getClipboard();
    const importDeck = validateDeckJson(clipboardContent);

    if (importDeck === false) {
      Alert.alert(
        'Could Not Import Deck',
        'Please ensure that you have a deck in MCBuilder shareable text format on your clipboard.',
      );

      return;
    }

    navigation.navigate('DecksImport', { deck: importDeck });
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
        <FloatingControlsCreateButtonWrapper
          onPress={() => navigation.navigate('DecksCreate')}
        >
          {({ pressed }) => (
            <FloatingControlsCreateButton pressed={pressed}>
              <FloatingControlsCreateButtonText pressed={pressed}>
                Create Deck
              </FloatingControlsCreateButtonText>
            </FloatingControlsCreateButton>
          )}
        </FloatingControlsCreateButtonWrapper>
        <FloatingControlsMenuButtonWrapper onPress={() => handleMenuOpen()}>
          {({ pressed }) => (
            <FloatingControlsMenuButton pressed={pressed}>
              <FontAwesomeIcon
                name="ellipsis-h"
                color={pressed ? colors.lightGray : colors.white}
                size={16}
                solid
              />
            </FloatingControlsMenuButton>
          )}
        </FloatingControlsMenuButtonWrapper>
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

const FloatingControlsCreateButtonWrapper = styled(
  FloatingControlsButtonWrapper,
)`
  flex: 1 1 auto;
  margin-horizontal: 4px;
`;

const FloatingControlsCreateButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.purpleDark : colors.purple};
`;

const FloatingControlsCreateButtonText = styled(base.ButtonText)<{
  pressed?: boolean;
}>``;

const FloatingControlsMenuButtonWrapper = styled(FloatingControlsButtonWrapper)`
  flex: none;
`;

const FloatingControlsMenuButton = styled(base.Button)<{ pressed?: boolean }>`
  background-color: ${(props) =>
    props.pressed ? colors.darkGrayDark : colors.darkGray};
`;

export default DecksListScreen;
