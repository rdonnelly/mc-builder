import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useContext, useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

import { DecksCreateContext } from '@context/DecksCreateContext';
import { FactionCode, SetCode, SetCodes } from '@data';
import { getPrimaryFactions } from '@data/models/Faction';
import { getHeroSets } from '@data/models/Set';
import { DecksCreateStackParamList } from '@navigation/DecksCreateStackNavigator';
import { base, colors } from '@styles';

const ITEM_HEIGHT = 48;

const sets = getHeroSets();
const aspects = getPrimaryFactions();

const DecksCreateSelectScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<
    DecksCreateStackParamList,
    'DecksCreateSelect'
  >;
  route: RouteProp<DecksCreateStackParamList, 'DecksCreateSelect'>;
}> = ({ navigation, route }) => {
  const { deckSet, setDeckSet, deckAspect, setDeckAspect } = useContext(
    DecksCreateContext,
  );

  const [selectedAspects, setSelectedAspects] = useState<FactionCode[]>(
    deckAspect,
  );

  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.setOptions({
      headerTitle:
        route.params.type === 'hero' ? 'Select Hero' : 'Select Aspect',
      headerBackTitleVisible: false,
    });
  }, [navigation, route]);

  const items = route.params.type === 'hero' ? sets : aspects;

  const handlePressItem = (code: FactionCode | SetCode) => {
    let isFinishedSelecting = false;

    if (route.params.type === 'hero') {
      setDeckSet(code as SetCode);
      isFinishedSelecting = true;
    }

    if (route.params.type === 'aspect') {
      let newSelectedAspects: FactionCode[];
      if (selectedAspects.includes(code as FactionCode)) {
        newSelectedAspects = selectedAspects.filter(
          (aspect) => aspect !== code,
        );
      } else if (
        deckSet === SetCodes.SPIDER_WOMAN &&
        selectedAspects.length > 0
      ) {
        newSelectedAspects = [
          ...selectedAspects.slice(-1),
          code as FactionCode,
        ];
      } else {
        newSelectedAspects = [code as FactionCode];
      }

      newSelectedAspects.sort();

      setSelectedAspects(newSelectedAspects);
      setDeckAspect(newSelectedAspects as FactionCode[]);

      // TODO get aspect count
      if (deckSet === SetCodes.SPIDER_WOMAN) {
        if (newSelectedAspects.length > 1) {
          isFinishedSelecting = true;
        }
      } else if (newSelectedAspects.length > 0) {
        isFinishedSelecting = true;
      }
    }

    if (isFinishedSelecting) {
      navigation.pop();
    }
  };

  const renderItem = ({ item }) => (
    <Row>
      <ListItemPressable onPress={() => handlePressItem(item.code)}>
        {({ pressed }) => (
          <ListItemInner pressed={pressed}>
            <ListItemInnerText>{item.name}</ListItemInnerText>
            <ListIconWrapper>
              <ListIcon
                active={item.code === deckSet || deckAspect.includes(item.code)}
              />
            </ListIconWrapper>
          </ListItemInner>
        )}
      </ListItemPressable>
    </Row>
  );

  return (
    <Container paddingBottom={insets.bottom}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.code}
        renderItem={renderItem}
      />
    </Container>
  );
};

const Container = styled(base.Container)<{ paddingBottom: number }>`
  padding-bottom: ${(props) => Math.max(props.paddingBottom, 16)}px;
`;

const FlatList = styled(base.FlatList)``;

const Row = styled(base.Container)`
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
`;

const ListItemInnerText = styled.Text`
  color: ${colors.darkGray};
  font-size: 18px;
  font-weight: 600;
`;

const ListIconWrapper = styled.View``;

const ListIcon = styled(base.ListChevron).attrs(() => ({
  name: 'check-circle',
  size: 20,
  solid: true,
}))<{ active: boolean }>`
  color: ${(props) => (props.active ? colors.green : colors.lightGray)};
`;

export default DecksCreateSelectScreen;
