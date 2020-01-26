import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Html from 'react-native-render-html';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { shareImageUrl } from '../utils/Share';
import { base, colors } from '../styles';

import { CardModel } from '../data';

const isTablet = DeviceInfo.isTablet();

const styles = StyleSheet.create({
  cardDetailText: {
    color: colors.darkGray,
    fontSize: isTablet ? 20 : 17,
    fontWeight: '500',
    letterSpacing: isTablet ? -0.54 : -0.408,
  },
});

const handleImageLongPress = (card: CardModel) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(card.imageSrc);
};

const renderCardText = (card: CardModel) => {
  let { text: cardText } = card;

  if (!cardText) {
    return null;
  }

  const customTagStyles = {
    i: { fontStyle: 'italic', fontWeight: '700' },
    p: { marginTop: 0, marginBottom: 0 },
  };

  return (
    <CardDetailTextWrapper>
      <Html
        html={cardText}
        baseFontStyle={styles.cardDetailText}
        tagsStyles={customTagStyles}
      />
    </CardDetailTextWrapper>
  );
};

const CardDetail: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  return (
    <Container>
      <View>{renderCardText(card)}</View>
      <ImageWrapper
        activeOpacity={0.9}
        onLongPress={() => handleImageLongPress(card)}
      >
        <Image resizeMode="contain" source={{ uri: card.imageSrc }} />
      </ImageWrapper>
    </Container>
  );
};

const Container = styled(base.Container)``;

const ImageWrapper = styled.TouchableOpacity`
  height: 440px;
  margin-bottom: 16px;
  padding: 16px;
  width: 100%;
`;

const Image = styled.Image`
  height: 100%;
  width: 100%;
`;

const CardDetailTextWrapper = styled.View`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  margin-bottom: 16px;
  padding-horizontal: 12px;
  padding-vertical: 16px;
  width: 100%;
`;

export default CardDetail;
