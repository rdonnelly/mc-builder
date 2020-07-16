import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import React, { useContext } from 'react';
import styled from 'styled-components/native';

import { DecksCreateContext } from '../../../context/DecksCreateContext';
import { DecksCreateStackParamList } from '../../../navigation/DecksCreateStackNavigator';
import { FactionCode, SetCode } from 'src/data';
import { base, colors } from '../../../styles';
import { getHeroSets } from '../../../data/models/Set';
import { getPrimaryFactions } from '../../../data/models/Faction';

const ITEM_HEIGHT = 48;

const sets = getHeroSets();
const aspects = getPrimaryFactions();

const DecksCreateScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<
    DecksCreateStackParamList,
    'DecksCreateSelect'
  >;
  route: RouteProp<DecksCreateStackParamList, 'DecksCreateSelect'>;
}> = ({ navigation, route }) => {
  const { deckSet, setDeckSet, deckAspect, setDeckAspect } = useContext(
    DecksCreateContext,
  );

  const insets = useSafeArea();

  navigation.setOptions({
    headerTitle: route.params.type === 'hero' ? 'Select Hero' : 'Select Aspect',
    headerBackTitleVisible: false,
  });

  const items = route.params.type === 'hero' ? sets : aspects;

  const handlePressItem = (code: FactionCode | SetCode) => {
    if (route.params.type === 'hero') {
      setDeckSet(code as SetCode);
    }
    if (route.params.type === 'aspect') {
      setDeckAspect(code as FactionCode);
    }
    navigation.pop();
  };

  const renderItem = ({ item }) => (
    <Row>
      <ListItemInner onPress={() => handlePressItem(item.code)}>
        <ListItemInnerText>{item.name}</ListItemInnerText>
        <ListIconWrapper>
          <ListIcon
            active={item.code === deckSet || item.code === deckAspect}
          />
        </ListIconWrapper>
      </ListItemInner>
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

const ListItemInner = styled.TouchableOpacity`
  align-items: center;
  flex: 1 1 auto;
  flex-direction: row;
  justify-content: space-between;
  padding-horizontal: 16px;
  width: 100%;
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

export default DecksCreateScreen;
