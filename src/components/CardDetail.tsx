import * as React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { base, colors } from '../styles';

import { ICardRaw, cards } from '../data';

const styles = StyleSheet.create({
  container: {
    ...base.container,
  },
  imageWrapper: {
    backgroundColor: colors.white,
    height: 440,
    marginBottom: 16,
    padding: 16,
    width: '100%',
  },
  imageWrapperBlue: {
    borderBottomColor: colors.blue,
    borderBottomWidth: 8,
    borderTopColor: colors.blue,
    borderTopWidth: 8,
  },
  image: {
    height: '100%',
    width: '100%',
  },
});

const CardDetail: React.FunctionComponent<{
  code: string;
}> = ({ code }) => {
  const card: ICardRaw | undefined = cards.find((c) => c.code === code);

  if (card == null) {
    return null;
  }

  const imageSrc = `https://marvelcdb.com/bundles/cards/${code}.jpg`;

  return (
    <View style={styles.container}>
      <Text>{card.name}</Text>
      <View style={styles.imageWrapper}>
        <TouchableOpacity
          activeOpacity={0.9}
          // onLongPress={this.handleImageLongPress}
        >
          <Image
            style={styles.image}
            resizeMode="contain"
            source={{ uri: imageSrc }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CardDetail;
