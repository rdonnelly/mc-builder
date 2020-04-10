import { ScrollView, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Html from 'react-native-render-html';
import React from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { CardModel } from '../data';
import { base, colors } from '../styles';
import { shareImageUrl } from '../utils/Share';
import CardParser from '../utils/CardParser';
import Icon, { IconCode } from '../components/Icon';

const isTablet = DeviceInfo.isTablet();

const styles = StyleSheet.create({
  cardDetailText: {
    color: colors.primary,
    fontSize: isTablet ? 20 : 17,
    fontWeight: '500',
    letterSpacing: isTablet ? -0.54 : -0.408,
  },
  cardDetailFlavor: {
    color: colors.primary,
    fontSize: isTablet ? 16 : 14,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: isTablet ? -0.54 : -0.408,
    textAlign: 'center',
  },
});

const renderCardText = (card: CardModel, key: string, isFlavor = false) => {
  let text = card[key];

  if (text == null) {
    return null;
  }

  text = CardParser.replaceEmphasis(text);
  text = CardParser.replaceLineBreaks(text);
  text = CardParser.replaceIconPlaceholders(text);

  const customRenderers = {
    icon: { renderer: CardParser.iconRenderer, wrapper: 'Text' },
  };

  const customTagStyles = {
    em: { fontStyle: 'italic', fontWeight: 'bold' },
    i: { fontStyle: 'italic', fontWeight: 'normal' },
    p: { marginTop: 0, marginBottom: 0 },
  };

  return (
    <CardDetailTextContainerSection key={`card-text-${key}`}>
      <Html
        html={text}
        baseFontStyle={
          isFlavor ? styles.cardDetailFlavor : styles.cardDetailText
        }
        tagsStyles={customTagStyles}
        renderers={customRenderers}
      />
    </CardDetailTextContainerSection>
  );
};

const handleImageLongPress = (card: CardModel) => {
  ReactNativeHapticFeedback.trigger('impactHeavy');
  shareImageUrl(card.imageSrc);
};

const CardDetailInfo: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  return (
    <CardDetailInfoContainer>
      <CardDetailInfoContainerSubtitle>
        <CardDetailInfoContainerSubtitleText>
          {card.raw.subname}
        </CardDetailInfoContainerSubtitleText>
      </CardDetailInfoContainerSubtitle>
      <CardDetailInfoContainerTypes>
        <CardDetailInfoContainerTypesTextBold>
          {`${card.typeName}.`}
        </CardDetailInfoContainerTypesTextBold>
        {card.raw.traits && (
          <CardDetailInfoContainerTypesText>
            {` ${card.raw.traits}`}
          </CardDetailInfoContainerTypesText>
        )}
      </CardDetailInfoContainerTypes>
    </CardDetailInfoContainer>
  );
};

const CardDetailStats: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  const stats = [];
  // https://github.com/zzorba/marvelsdb/blob/89a8b0aacdb00a561e1c3b237c67654254a1cad8/src/AppBundle/Resources/public/js/app.format.js
  switch (card.typeCode) {
    case 'hero': {
      stats.push(
        <Stat key={'thwart'}>
          <StatData>
            <StatDataText>{card.raw.thwart}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>THW</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'attack-spacer'} />,
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>{card.raw.attack}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>ATK</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'defense-spacer'} />,
        <Stat key={'defense'}>
          <StatData>
            <StatDataText>{card.raw.defense}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>DEF</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'hand-spacer'} />,
        <Stat key={'hand-size'}>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HAND</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
      );
      break;
    }
    case 'alter_ego': {
      stats.push(
        <Stat key={'recover'}>
          <StatData>
            <StatDataText>{card.raw.recover}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>REC</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'hand-spacer'} />,
        <Stat key={'hand-size'}>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HAND</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
      );
      break;
    }
    case 'side_scheme':
    case 'main_scheme': {
      stats.push(
        card.raw.threat == null ? null : (
          <Stat key={'threat-threat'}>
            <StatData>
              <StatDataText>
                {card.raw.threat}
                <Icon code={IconCode.perHero} size={16} />
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>TARGET THREAT</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
        card.raw.threat == null ? null : <StatSpacer key={'threat-spacer'} />,
        <Stat key={'base-threat'}>
          <StatData>
            <StatDataText>
              {card.raw.base_threat}
              {!card.raw.base_threat || card.raw.base_threat_fixed ? null : (
                <Icon code={IconCode.perHero} size={16} />
              )}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>BASE THREAT</StatHeaderText>
          </StatHeader>
        </Stat>,
        card.raw.escalation_threat == null ? null : (
          <StatSpacer key={'escalation-spacer'} />
        ),
        card.raw.escalation_threat == null ? null : (
          <Stat key={'escalation-threat'}>
            <StatData>
              <StatDataText>
                +{card.raw.escalation_threat}
                {!card.raw.escalation_threat ||
                card.raw.escalation_threat_fixed ? null : (
                  <Icon code={IconCode.perHero} size={16} />
                )}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ESC THREAT</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
      );

      break;
    }
    case 'attachment': {
      // TODO
      stats.push(
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>{card.raw.attack}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>ATK</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'scheme-spacer'} />,
        <Stat key={'scheme'}>
          <StatData>
            <StatDataText>{card.raw.scheme}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>SCH</StatHeaderText>
          </StatHeader>
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
          <Stat key={'cost'}>
            <StatData>
              <StatDataText>{card.raw.cost}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>COST</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      if (card.typeCode === 'ally') {
        stats.push(
          <StatSpacer key={'attack-spacer'} />,
          <Stat key={'attack'}>
            <StatData>
              <StatDataText>
                {card.raw.attack}
                {[...Array(card.raw.attack_cost || 0).keys()].map((i) => (
                  <Icon code={IconCode.cost} size={16} key={`icon-${i}`} />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ATK</StatHeaderText>
            </StatHeader>
          </Stat>,
          <StatSpacer key={'thwart-spacer'} />,
          <Stat key={'thwart'}>
            <StatData>
              <StatDataText>
                {card.raw.thwart != null ? card.raw.thwart : '–'}
                {[...Array(card.raw.thwart_cost || 0).keys()].map((i) => (
                  <Icon code={IconCode.cost} size={20} key={`icon-${i}`} />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>THW</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      if (card.raw.health) {
        stats.push(
          <StatSpacer key={'health-spacer'} />,
          <Stat key={'health'}>
            <StatData>
              <StatDataText>{card.raw.health}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>HP</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      break;
    }
    case 'villain':
    case 'minion':
      break;
  }
  return <CardDetailStatsContainer>{stats}</CardDetailStatsContainer>;
};

const renderCardSchemeTraits = (card: CardModel) => {
  const icons = [];

  if (card.raw.scheme_acceleration) {
    icons.push(
      <Icon code={IconCode.acceleration} color={colors.primary} size={40} />,
    );
  }

  if (card.raw.scheme_crisis) {
    icons.push(
      <Icon code={IconCode.crisis} color={colors.primary} size={40} />,
    );
  }

  if (card.raw.scheme_hazard) {
    icons.push(
      <Icon code={IconCode.hazard} color={colors.primary} size={40} />,
    );
  }

  return icons.length === 0 ? null : (
    <CardDetailTextContainerTraits>
      <CardDetailTextContainerTraitsText>
        {icons}
      </CardDetailTextContainerTraitsText>
    </CardDetailTextContainerTraits>
  );
};

const CardDetailText: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  const sections = [
    renderCardText(card, 'backFlavor', true),
    renderCardText(card, 'backText'),
    renderCardText(card, 'flavor', true),
    renderCardSchemeTraits(card),
    renderCardText(card, 'text'),
    renderCardText(card, 'attackText'),
    renderCardText(card, 'schemeText'),
  ]
    .filter((section) => section != null)
    .reduce((newSections, section, i) => {
      if (i !== 0) {
        newSections.push(
          <CardDetailTextContainerDivider key={`card-text-divider-${i}`} />,
        );
      }

      newSections.push(section);

      return newSections;
    }, []);

  return <CardDetailTextContainer>{sections}</CardDetailTextContainer>;
};

const CardDetailImage: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  return (
    <CardDetailImageContainer
      activeOpacity={0.9}
      onLongPress={() => handleImageLongPress(card)}
    >
      <Image resizeMode="contain" source={{ uri: card.imageSrc }} />
    </CardDetailImageContainer>
  );
};

const CardDetail: React.FunctionComponent<{
  card: CardModel;
  width: number;
}> = ({ card, width }) => {
  return (
    <CardDetailContainer width={width}>
      <ContainerScrollView>
        <CardDetailInfo card={card} />
        <CardDetailStats card={card} />
        <CardDetailText card={card} />
        <CardDetailImage card={card} />
      </ContainerScrollView>
    </CardDetailContainer>
  );
};

const CardDetailContainer = styled(base.Container)<{ width: number }>`
  background-color: ${colors.white};
  padding-vertical: 16px;
  width: ${(props) => props.width}px;
`;

const ContainerScrollView = styled(ScrollView)`
  flex: 1 1 auto;
  width: 100%;
`;

const CardDetailInfoContainer = styled(base.Container)`
  margin-bottom: 16px;
`;

const CardDetailInfoContainerSubtitle = styled.View``;

const CardDetailInfoContainerSubtitleText = styled.Text``;

const CardDetailInfoContainerTypes = styled.View`
  flex-direction: row;
`;

const CardDetailInfoContainerTypesText = styled.Text``;

const CardDetailInfoContainerTypesTextBold = styled.Text`
  font-weight: bold;
`;

const CardDetailStatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Stat = styled.View`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  flex: 1;
  justify-content: flex-end;
  padding: 16px;
`;

const StatHeader = styled.View``;

const StatHeaderText = styled.Text`
  color: ${colors.grayDark};
  font-weight: 700;
`;

const StatData = styled.View``;

const StatDataText = styled.Text`
  color: ${colors.primary};
  font-size: 22px;
  font-weight: bold;
`;

const StatSpacer = styled.View`
  width: 16px;
`;

const CardDetailTextContainer = styled.View`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  flex: 1 1 auto;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-top: 16px;
  width: 100%;
`;

const CardDetailTextContainerSection = styled.View`
  margin-bottom: 16px;
`;

const CardDetailTextContainerTraits = styled(CardDetailTextContainerSection)``;

const CardDetailTextContainerTraitsText = styled.Text`
  text-align: center;
`;

const CardDetailTextContainerDivider = styled.View`
  background-color: ${colors.lightGrayDark};
  height: ${StyleSheet.hairlineWidth}px;
  margin-horizontal: 32px;
  margin-bottom: 16px;
`;

const CardDetailImageContainer = styled.TouchableOpacity`
  height: 440px;
  margin-bottom: 16px;
  padding: 16px;
  width: 100%;
`;

const Image = styled.Image`
  height: 100%;
  width: 100%;
`;

export default CardDetail;
