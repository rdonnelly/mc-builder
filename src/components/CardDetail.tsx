import { Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Html from 'react-native-render-html';
import React, { useEffect, useState } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import styled from 'styled-components/native';

import { CardModel, FactionCodes } from '../data';
import { base, colors } from '../styles';
import { shareImageUrl } from '../utils/Share';
import CardParser from '../utils/CardParser';
import Icon, { IconCode } from '../components/Icon';

const isTablet = DeviceInfo.isTablet();

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 72,
  },
  cardDetailText: {
    color: colors.primary,
    fontSize: isTablet ? 20 : 17,
    fontWeight: '500',
    letterSpacing: isTablet ? -0.54 : -0.408,
  },
  cardDetailFlavor: {
    color: colors.subdued,
    fontSize: isTablet ? 16 : 14,
    fontStyle: 'italic',
    fontWeight: '600',
    letterSpacing: isTablet ? -0.54 : -0.408,
    textAlign: 'center',
  },
});

const customTagStyles = {
  b: { fontWeight: 'bold' },
  em: {
    // fontFamily: 'Komika Title - Wide',
    // fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
  },
  i: { fontStyle: 'italic', fontWeight: '500' },
  p: { marginTop: 0, marginBottom: 0 },
};

const renderCardText = (card: CardModel, key: string, isFlavor = false) => {
  let text = card[key];

  if (text == null || text === '') {
    return null;
  }

  text = CardParser.replaceEmphasis(text);
  text = CardParser.replaceLineBreaks(text);
  text = CardParser.replaceIconPlaceholders(text);

  const customRenderers = {
    icon: { renderer: CardParser.iconRenderer, wrapper: 'Text' as const },
  };

  return (
    <CardDetailTextContainerSection key={`card-text-${card.code}-${key}`}>
      <Html
        source={{ html: text }}
        baseFontStyle={
          isFlavor ? styles.cardDetailFlavor : styles.cardDetailText
        }
        tagsStyles={customTagStyles}
        renderers={customRenderers}
        allowWhitespaceNodes={true}
        defaultTextProps={{ selectable: true }}
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
    <>
      {card.raw.subname != null ? (
        <CardDetailInfoContainer>
          <CardDetailInfoContainerSubtitle>
            <CardDetailInfoContainerSubtitleText>
              {card.raw.subname}
            </CardDetailInfoContainerSubtitleText>
          </CardDetailInfoContainerSubtitle>
        </CardDetailInfoContainer>
      ) : null}
      <CardDetailInfoContainer>
        <CardDetailInfoContainerTypes>
          <CardDetailInfoContainerTypesTextBold>
            {`${card.typeName}.`}
          </CardDetailInfoContainerTypesTextBold>
          {card.raw.traits ? (
            <CardDetailInfoContainerTypesText>
              {` ${card.raw.traits}`}
            </CardDetailInfoContainerTypesText>
          ) : null}
        </CardDetailInfoContainerTypes>
      </CardDetailInfoContainer>
    </>
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
            <StatDataText>
              {card.raw.thwart}
              {card.raw.scheme_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>THW</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'attack-spacer'} />,
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>
              {card.raw.attack}
              {card.raw.attack_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
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
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
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
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
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
                  <Icon
                    code={IconCode.perHero}
                    color={colors.grayDark}
                    size={16}
                  />
                )}
                {card.raw.escalation_threat_fixed ? null : (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
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
      stats.push(
        card.raw.attack == null ? null : (
          <Stat key={'attack'}>
            <StatData>
              <StatDataText>
                +{card.raw.attack}
                {card.raw.attack_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ATK</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
        card.raw.attack == null || card.raw.scheme == null ? null : (
          <StatSpacer key={'scheme-spacer'} />
        ),
        card.raw.scheme == null ? null : (
          <Stat key={'scheme'}>
            <StatData>
              <StatDataText>
                +{card.raw.scheme}
                {card.raw.scheme_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>SCH</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
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
          <StatSpacer key={'thwart-spacer'} />,
          <Stat key={'thwart'}>
            <StatData>
              <StatDataText>
                {card.raw.thwart != null ? card.raw.thwart : '–'}
                {card.raw.scheme_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
                {[...Array(card.raw.thwart_cost || 0).keys()].map((i) => (
                  <Icon
                    code={IconCode.cost}
                    color={colors.grayDark}
                    size={16}
                    key={`icon-${i}`}
                  />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>THW</StatHeaderText>
            </StatHeader>
          </Stat>,
          <StatSpacer key={'attack-spacer'} />,
          <Stat key={'attack'}>
            <StatData>
              <StatDataText>
                {card.raw.attack}
                {card.raw.attack_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
                {[...Array(card.raw.attack_cost || 0).keys()].map((i) => (
                  <Icon
                    code={IconCode.cost}
                    color={colors.grayDark}
                    size={16}
                    key={`icon-${i}`}
                  />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ATK</StatHeaderText>
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
      stats.push(
        <Stat key={'scheme'}>
          <StatData>
            <StatDataText>
              {card.raw.scheme}
              {card.raw.scheme_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>SCH</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'attack-spacer'} />,
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>
              {card.raw.attack}
              {card.raw.attack_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>ATK</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>
              {card.raw.health}
              {card.isHealthPerHero ? (
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
        card.typeCode !== 'villain' ? null : (
          <StatSpacer key={'stage-spacer'} />
        ),
        card.typeCode !== 'villain' ? null : (
          <Stat key={'stage'}>
            <StatData>
              <StatDataText>{card.raw.stage}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>STAGE</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
      );
      break;
  }
  return <CardDetailStatsContainer>{stats}</CardDetailStatsContainer>;
};

const renderCardSchemeTraits = (card: CardModel) => {
  const icons = [];

  if (card.raw.scheme_acceleration) {
    icons.push(
      <Icon
        code={IconCode.acceleration}
        color={colors.darkGray}
        size={40}
        key={'card-scheme-traits-acceleration'}
      />,
    );
  }

  if (card.raw.scheme_crisis) {
    icons.push(
      <Icon
        code={IconCode.crisis}
        color={colors.darkGray}
        size={40}
        key={'card-scheme-traits-crisis'}
      />,
    );
  }

  if (card.raw.scheme_hazard) {
    icons.push(
      <Icon
        code={IconCode.hazard}
        color={colors.darkGray}
        size={40}
        key={'card-scheme-traits-hazard'}
      />,
    );
  }

  return icons.length === 0 ? null : (
    <CardDetailTextContainerTraits key={`card-text-${card.code}-traits`}>
      <CardDetailTextContainerTraitsText>
        {icons}
      </CardDetailTextContainerTraitsText>
    </CardDetailTextContainerTraits>
  );
};

const CardDetailText: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  let sections = [];

  if (card.factionCode === FactionCodes.ENCOUNTER) {
    sections.push(renderCardText(card, 'backFlavor', true));
    sections.push(renderCardText(card, 'backText'));
    sections.push(renderCardText(card, 'flavor', true));
    sections.push(renderCardText(card, 'text'));
    sections.push(renderCardSchemeTraits(card));
  } else {
    sections.push(renderCardText(card, 'backText'));
    sections.push(renderCardText(card, 'backFlavor', true));
    sections.push(renderCardText(card, 'text'));
    sections.push(renderCardSchemeTraits(card));
    sections.push(renderCardText(card, 'flavor', true));
  }

  sections.push(renderCardText(card, 'attackText'));
  if (card.attackText !== card.schemeText) {
    sections.push(renderCardText(card, 'schemeText'));
  }
  sections.push(renderCardText(card, 'boostText'));

  sections = sections
    .filter((section) => section != null)
    .reduce((newSections, section, i) => {
      if (i !== 0) {
        newSections.push(
          <CardDetailTextContainerDivider
            key={`card-text-divider-${card.code}-${i}`}
          />,
        );
      }

      newSections.push(section);

      return newSections;
    }, []);

  return <CardDetailTextContainer>{sections}</CardDetailTextContainer>;
};

const CardDetailFooter: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  let factionOrSetText = '';
  if (card.setName != null) {
    factionOrSetText = card.setName;
    if (card.setPosition != null) {
      const setNumbers = [];
      for (let i = 0, j = card.raw.quantity; i < j; i++) {
        setNumbers.push(`#${card.setPosition + i}`);
      }
      factionOrSetText += ` (${setNumbers.join(', ')})`;
    }
  } else {
    factionOrSetText = card.factionName;
  }

  card.setName != null ? card.setName : card.factionName;
  const factionColor =
    card.setName == null ? colors.factions[`${card.factionCode}Dark`] : null;

  const resources = card.resources;
  const resourceIcons =
    resources == null
      ? null
      : Object.keys(resources).reduce((icons, resourceKey) => {
          if (!resources[resourceKey]) {
            return icons;
          }

          icons.push(
            ...Array(resources[resourceKey])
              .fill('')
              .map((_val, i) => (
                <CardDetailFooterContainerResourceWrapper
                  color={colors.icons[`${resourceKey}Background`]}
                  key={`resource_icon_${i}`}
                >
                  <Icon
                    code={IconCode[resourceKey]}
                    color={colors.icons[`${resourceKey}Tint`]}
                  />
                </CardDetailFooterContainerResourceWrapper>
              )),
          );

          return icons;
        }, []);

  return (
    <CardDetailFooterContainer>
      {resources != null ? (
        <CardDetailFooterContainerResource>
          {resourceIcons}
        </CardDetailFooterContainerResource>
      ) : null}
      {card.raw.boost == null && card.boostText == null ? null : (
        <CardDetailFooterContainerBoost>
          {card.boostText ? (
            <Icon code={IconCode.special} color={colors.darkGray} size={16} />
          ) : null}
          {[...Array(card.raw.boost || 0).keys()].map((i) => (
            <Icon
              code={IconCode.boost}
              color={colors.darkGray}
              size={16}
              key={`icon-${i}`}
            />
          ))}
        </CardDetailFooterContainerBoost>
      )}
      <CardDetailFooterContainerSet>
        <CardDetailFooterContainerSetText color={factionColor}>
          {factionOrSetText}
        </CardDetailFooterContainerSetText>
      </CardDetailFooterContainerSet>
    </CardDetailFooterContainer>
  );
};

const CardDetailImages: React.FunctionComponent<{
  card: CardModel;
  maxWidth: number;
}> = ({ card, maxWidth }) => {
  const imageUriSet = card.imageUriSet;

  return imageUriSet && imageUriSet.length ? (
    <>
      {imageUriSet.map((imageUri, i) => (
        <CardDetailImage
          key={`card_image_${card.code}_${i}`}
          card={card}
          imageUri={imageUri}
          maxWidth={maxWidth}
        />
      ))}
    </>
  ) : null;
};

const CardDetailImage = ({
  card,
  imageUri,
  maxWidth,
}: {
  card: CardModel;
  imageUri: string;
  maxWidth: number;
}) => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        const newWidth = Math.min(width, maxWidth);
        const newHeight = (height / width) * newWidth;

        setImageHeight(newHeight);
        setImageWidth(newWidth);
      },
      () => {},
    );
  }, [imageUri]);

  if (!imageHeight || !imageWidth) {
    return null;
  }

  return (
    <Pressable onLongPress={() => handleImageLongPress(card)}>
      {({ pressed }) => (
        <CardDetailImageContainer
          height={imageHeight}
          width={imageWidth}
          pressed={pressed}
        >
          <CardImage resizeMode="contain" source={{ uri: `${imageUri}` }} />
        </CardDetailImageContainer>
      )}
    </Pressable>
  );
};

const CardDetailPack: React.FunctionComponent<{
  card: CardModel;
}> = ({ card }) => {
  return (
    <CardDetailPackContainer>
      <CardDetailPackContainerText>{`${card.pack.name} #${card.packPosition}`}</CardDetailPackContainerText>
    </CardDetailPackContainer>
  );
};

const CardDetail: React.FunctionComponent<{
  card: CardModel;
  width: number;
}> = ({ card, width }) => {
  return (
    <CardDetailContainer width={width}>
      <ContainerScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <CardDetailInfo card={card} />
        <CardDetailStats card={card} />
        <CardDetailText card={card} />
        <CardDetailFooter card={card} />
        <CardDetailImages card={card} maxWidth={width} />
        <CardDetailPack card={card} />
      </ContainerScrollView>
    </CardDetailContainer>
  );
};

const CardDetailContainer = styled(base.Container)<{ width: number }>`
  background-color: ${colors.white};
  width: ${(props) => props.width}px;
`;

const ContainerScrollView = styled(ScrollView)`
  flex: 1 1 auto;
  width: 100%;
`;

const CardDetailInfoContainer = styled(base.Container)`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailInfoContainerSubtitle = styled.View``;

const CardDetailInfoContainerSubtitleText = styled.Text`
  color: ${colors.darkGray};
  font-size: 15px;
  font-weight: 700;
`;

const CardDetailInfoContainerTypes = styled.View`
  flex-direction: row;
`;

const CardDetailInfoContainerTypesText = styled.Text`
  color: ${colors.darkGray};
  font-size: 17px;
  font-weight: 500;
`;

const CardDetailInfoContainerTypesTextBold = styled.Text`
  color: ${colors.darkGray};
  font-size: 17px;
  font-weight: bold;
`;

const CardDetailStatsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-horizontal: -8px;
`;

const Stat = styled.View`
  background-color: ${colors.lightGray};
  border-radius: 4px;
  flex: 1 1 80px;
  justify-content: flex-end;
  margin-bottom: 16px;
  margin-horizontal: 8px;
  padding: 16px;
`;

const StatData = styled.View``;

const StatDataText = styled.Text`
  color: ${colors.darkGray};
  font-size: 22px;
  font-weight: bold;
`;

const StatHeader = styled.View``;

const StatHeaderText = styled.Text`
  color: ${colors.grayDark};
  font-weight: 700;
`;

const StatSpacer = styled.View``;

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

const CardDetailFooterContainer = styled.View`
  align-items: center;
  background-color: ${colors.lightGray};
  border-radius: 4px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
  width: 100%;
`;

const CardDetailFooterContainerResource = styled.View`
  flex-direction: row;
`;

const CardDetailFooterContainerResourceWrapper = styled.View<{
  color: string;
}>`
  background-color: ${(props) => (props.color ? props.color : colors.darkGray)};
  border-radius: 4px;
  margin-right: 4px;
  padding: 4px;
`;

const CardDetailFooterContainerSet = styled.View`
  flex-direction: row;
`;

const CardDetailFooterContainerSetText = styled.Text<{
  color: string;
}>`
  color: ${(props) => (props.color ? props.color : colors.darkGray)};
  font-weight: 600;
`;

const CardDetailFooterContainerBoost = styled.View`
  flex-direction: row;
`;

const CardDetailImageContainer = styled.View<{
  height: number;
  width: number;
  pressed: boolean;
}>`
  height: ${(props) => props.height}px;
  margin-bottom: 16px;
  opacity: ${(props) => (props.pressed ? 0.9 : 1.0)};
  padding-horizontal: 0px;
  width: ${(props) => props.width}px;
`;

const CardImage = styled.Image`
  height: 100%;
  width: 100%;
`;

const CardDetailPackContainer = styled.View`
  align-items: center;
  margin-bottom: 16px;
  padding-horizontal: 16px;
  padding-vertical: 8px;
`;

const CardDetailPackContainerText = styled.Text`
  color: ${colors.darkGray};
  font-size: 17px;
  font-style: italic;
`;

export default CardDetail;
