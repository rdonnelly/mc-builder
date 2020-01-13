import * as React from 'react';
import { useRef } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { CardStackParamList } from '../navigation/CardsStackNavigator';
import CardListItem from '../components/CardListItem';
import { base, colors } from '../styles';

import { ICardRaw, cards } from '../data';

const styles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
  },
  list: {
    backgroundColor: colors.white,
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 16,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  footerText: {
    color: colors.gray,
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
});

const CardListScreen: React.FunctionComponent<{
  navigation: StackNavigationProp<CardStackParamList, 'CardList'>;
}> = (props) => {
  const flatListRef = useRef(null);

  useScrollToTop(flatListRef);

  const handlePressItem = (code: string) => {
    if (props.navigation) {
      props.navigation.navigate('CardDetail', {
        code,
      });
    }
  };

  const renderCard = ({ item: card }: { item: ICardRaw }) => (
    <CardListItem
      card={card}
      isSelected={false}
      onPressItem={handlePressItem}
    />
  );

  const renderFooter = () => {
    if (cards.length === 0) {
      return null;
    }

    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Showing {cards.length} Card
          {cards.length === 1 ? '' : 's'}
        </Text>
      </View>
    );
  };

  return (
    <View style={base.container}>
      <FlatList
        ref={flatListRef}
        renderItem={renderCard}
        data={cards}
        keyExtractor={(card: ICardRaw) => card.code}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

export default CardListScreen;
