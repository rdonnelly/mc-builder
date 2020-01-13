import * as React from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5Pro';

import { base, colors } from '../styles';

import { ICardRaw } from '../data';

export const ITEM_HEIGHT = 58;

const styles = StyleSheet.create({
  container: {
    ...base.container,
    backgroundColor: colors.lightGray,
    borderBottomColor: colors.lightGrayDark,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    height: ITEM_HEIGHT,
    justifyContent: 'center',
  },
  containerSelected: {
    backgroundColor: colors.white,
  },
  containerTappable: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    width: '100%',
  },
  cardDetails: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardDetailsName: {
    paddingVertical: 1,
  },
  cardDetailsNameText: {
    color: colors.darkGray,
    fontSize: 18,
    fontWeight: '600',
  },
  cardDetailsInfo: {
    flexDirection: 'row',
    paddingVertical: 1,
  },
  cardDetailsInfoText: {
    color: colors.gray,
    fontSize: 13,
    fontWeight: '500',
  },
  chevronWrapper: {},
  chevron: {
    color: colors.lightGrayDark,
    marginTop: 2,
  },
  chevronSelected: {
    color: colors.brand,
  },
});

const CardListItem: React.FunctionComponent<{
  card: ICardRaw;
  isSelected: boolean;
  onPressItem: any;
}> = ({ card, isSelected, onPressItem }) => {
  const rowStyles: ViewStyle[] = [styles.container];
  const chevronStyles: TextStyle[] = [styles.chevron];
  if (isSelected) {
    rowStyles.push(styles.containerSelected);
    chevronStyles.push(styles.chevronSelected);
  }

  return (
    <View style={rowStyles}>
      <TouchableOpacity
        onPress={() => onPressItem(card.code)}
        style={styles.containerTappable}
      >
        <View style={styles.cardDetails}>
          <View style={styles.cardDetailsName}>
            <Text style={styles.cardDetailsNameText} numberOfLines={1}>
              {card.name}
            </Text>
          </View>
          <View style={styles.cardDetailsInfo}>
            <Text style={styles.cardDetailsInfoText}>
              <Text>
                {card.pack_code}&nbsp;{card.position}
              </Text>
              <Text>&nbsp;&middot;&nbsp;{card.type_code}</Text>
              <Text>&nbsp;&middot;&nbsp;{card.set_code}</Text>
              {card.cost != null && (
                <Text>&nbsp;&middot;&nbsp;{card.cost}</Text>
              )}
            </Text>
          </View>
        </View>
        <View style={styles.chevronWrapper}>
          <FontAwesomeIcon
            name={'chevron-right'}
            size={16}
            style={chevronStyles}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default CardListItem;
