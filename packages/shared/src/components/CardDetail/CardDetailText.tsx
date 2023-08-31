import { StyleSheet, Text } from 'react-native';
import Html from 'react-native-render-html';
import styled from 'styled-components/native';

import Icon, { IconCode, iconRenderer } from '../../components/Icon';
import { FactionCodes } from '../../data';
import { Card as CardModel } from '../../data/models/Card';
import { colors } from '../../styles';
import CardParser from '../../utils/CardParser';

const customTagStyles = {
  b: { fontWeight: 'bold' },
  em: {
    // fontFamily: 'Komika Title - Wide',
    // fontSize: 12,
    fontStyle: 'italic',
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
    icon: { renderer: iconRenderer, wrapper: 'Text' as const },
  };

  return (
    <CardDetailTextContainerSection key={`card-text-${card.code}-${key}`}>
      <Html
        source={{ html: text }}
        baseFontStyle={
          isFlavor
            ? {
                color: colors.text.subdued,
                fontSize: 14,
                fontStyle: 'italic',
                fontWeight: '600',
                letterSpacing: -0.408,
                textAlign: 'center',
              }
            : {
                color: colors.text.primary,
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

  if (card.schemeCrisis) {
    icons.push(
      <Icon
        code={IconCode.crisis}
        color={colors.slate600}
        size={40}
        key={'card-scheme-traits-crisis'}
      />,
    );
  }

  if (card.schemeAcceleration) {
    icons.push(
      <Icon
        code={IconCode.acceleration}
        color={colors.slate600}
        size={40}
        key={'card-scheme-traits-acceleration'}
      />,
    );
  }

  // TODO amplify icon from font
  if (card.schemeAmplify) {
    icons.push(<Text key={'card-scheme-traits-amplify'}>AMPLIFY</Text>);
  }

  if (card.schemeHazard) {
    icons.push(
      <Icon
        code={IconCode.hazard}
        color={colors.slate600}
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

  if (sections.length === 0) {
    return null;
  }

  return <CardDetailTextContainer>{sections}</CardDetailTextContainer>;
};

const CardDetailTextContainer = styled.View`
  background-color: ${({ theme }) => theme.color.app.layer100};
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
  background-color: ${({ theme }) => theme.color.typography.primary};
  height: ${StyleSheet.hairlineWidth}px;
  margin-horizontal: 32px;
  margin-bottom: 16px;
`;

export default CardDetailText;
