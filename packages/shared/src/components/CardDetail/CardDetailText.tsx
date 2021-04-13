import { StyleSheet } from 'react-native';
import Html from 'react-native-render-html';
import styled from 'styled-components/native';

import Icon, { IconCode } from '../../components/Icon';
import { CardModel, FactionCodes } from '../../data';
import { colors } from '../../styles';
import CardParser from '../../utils/CardParser';

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
          isFlavor
            ? {
                color: colors.subdued,
                fontSize: 14,
                fontStyle: 'italic',
                fontWeight: '600',
                letterSpacing: -0.408,
                textAlign: 'center',
              }
            : {
                color: colors.primary,
                fontSize: 17,
                fontWeight: '500',
                letterSpacing: -0.408,
              }
        }
        tagsStyles={customTagStyles}
        renderers={customRenderers}
        allowWhitespaceNodes={true}
        defaultTextProps={{ selectable: true }}
      />
    </CardDetailTextContainerSection>
  );
};

const renderCardSchemeTraits = (card: CardModel) => {
  const icons = [];

  if (card.schemeAcceleration) {
    icons.push(
      <Icon
        code={IconCode.acceleration}
        color={colors.darkGray}
        size={40}
        key={'card-scheme-traits-acceleration'}
      />,
    );
  }

  if (card.schemeCrisis) {
    icons.push(
      <Icon
        code={IconCode.crisis}
        color={colors.darkGray}
        size={40}
        key={'card-scheme-traits-crisis'}
      />,
    );
  }

  if (card.schemeHazard) {
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

const CardDetailText = ({ card }: { card: CardModel }) => {
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

const CardDetailTextContainer = styled.View`
  background-color: ${colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

export default CardDetailText;
