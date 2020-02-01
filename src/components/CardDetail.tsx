import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Html from 'react-native-render-html';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { base, colors } from '../styles';
import { shareImageUrl } from '../utils/Share';

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

const getStats = (card: CardModel) => {
  const stats = [];
  // https://github.com/zzorba/marvelsdb/blob/89a8b0aacdb00a561e1c3b237c67654254a1cad8/src/AppBundle/Resources/public/js/app.format.js
  switch (card.typeCode) {
    case 'hero': {
      stats.push(
        <Stat>
          <StatHeader>
            <StatHeaderText>Thwart</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.thwart}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Attack</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.attack}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Defense</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.defense}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Hand Size</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Hit Points</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
        </Stat>,
      );
      break;
    }
    case 'alter_ego': {
      stats.push(
        <Stat>
          <StatHeader>
            <StatHeaderText>Recover</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.recover}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Hand Size</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Hit Points</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
        </Stat>,
      );
      break;
    }
    case 'side_scheme':
    case 'main_scheme': {
      // TODO
      stats.push(
        <Stat>
          <StatHeader>
            <StatHeaderText>Starting Threat</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.base_threat}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Escalation Threat</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.escalation_threat}</StatDataText>
          </StatData>
        </Stat>,
      );

      break;
    }
    case 'attachment': {
      // TODO
      stats.push(
        <Stat>
          <StatHeader>
            <StatHeaderText>Attack</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.attack}</StatDataText>
          </StatData>
        </Stat>,
        <Stat>
          <StatHeader>
            <StatHeaderText>Scheme</StatHeaderText>
          </StatHeader>
          <StatData>
            <StatDataText>{card.raw.scheme}</StatDataText>
          </StatData>
        </Stat>,
      );
      break;
    }

    case 'support':
    case 'ally':
    case 'upgrade':
    case 'resource':
    case 'event': {
      if (card.typeCode !== 'resource') {
        stats.push(
          <Stat>
            <StatHeader>
              <StatHeaderText>Cost</StatHeaderText>
            </StatHeader>
            <StatData>
              <StatDataText>{card.raw.cost}</StatDataText>
            </StatData>
          </Stat>,
        );
      }

      if (card.typeCode === 'ally') {
        stats.push(
          <Stat>
            <StatHeader>
              <StatHeaderText>Attack</StatHeaderText>
            </StatHeader>
            <StatData>
              <StatDataText>
                {card.raw.attack}
                {'*'.repeat(card.raw.attack_cost || 0)}
              </StatDataText>
            </StatData>
          </Stat>,
          <Stat>
            <StatHeader>
              <StatHeaderText>Thwart</StatHeaderText>
            </StatHeader>
            <StatData>
              <StatDataText>
                {card.raw.thwart}
                {'*'.repeat(card.raw.thwart_cost || 0)}
              </StatDataText>
            </StatData>
          </Stat>,
        );
      }

      if (card.raw.health) {
        stats.push(
          <Stat>
            <StatHeader>
              <StatHeaderText>Health</StatHeaderText>
            </StatHeader>
            <StatData>
              <StatDataText>{card.raw.health}</StatDataText>
            </StatData>
          </Stat>,
        );
      }

      break;
    }
    case 'villain':
    case 'minion':
      break;
  }
  return stats;
};

const renderCardText = (text: string) => {
  if (!text) {
    return null;
  }

  const customTagStyles = {
    i: { fontStyle: 'italic', fontWeight: '700' },
    p: { marginTop: 0, marginBottom: 0 },
  };

  return (
    <CardDetailTextWrapper>
      <Html
        html={text}
        baseFontStyle={styles.cardDetailText}
        tagsStyles={customTagStyles}
      />
    </CardDetailTextWrapper>
  );
};

const handleImageLongPress = (card: CardModel) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(card.imageSrc);
};

const CardDetail: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  return (
    <Container>
      <ContainerScrollView>
        <StatWrapper>{getStats(card)}</StatWrapper>
        {renderCardText(card.text)}
        {renderCardText(card.backText)}
        {renderCardText(card.attackText)}
        {renderCardText(card.schemeText)}
        <ImageWrapper
          activeOpacity={0.9}
          onLongPress={() => handleImageLongPress(card)}
        >
          <Image resizeMode="contain" source={{ uri: card.imageSrc }} />
        </ImageWrapper>
      </ContainerScrollView>
    </Container>
  );
};

const Container = styled(base.Container)``;

const ContainerScrollView = styled(ScrollView)`
  flex: 1 1 auto;
  width: 100%;
`;

const StatWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  margin-horizontal: 8px;
`;

const Stat = styled.View`
  margin: 8px;
  padding: 8px;
`;

const StatHeader = styled.View``;

const StatHeaderText = styled.Text`
  color: ${colors.grayDark};
  font-weight: 700;
`;

const StatData = styled.View``;

const StatDataText = styled.Text`
  font-size: 20px;
`;

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
  flex: 1 1 auto;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 16px;
  width: 100%;
`;

export default CardDetail;
