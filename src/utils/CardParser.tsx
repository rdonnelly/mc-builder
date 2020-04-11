import React from 'react';

import { colors } from '../styles';
import Icon, { IconCode } from '../components/Icon';

const ICON_REPLACEMENTS = Object.freeze({
  acceleration: '<icon code="acceleration"></icon>',
  boost: '<icon code="boost"></icon>',
  cost: '<icon code="cost"></icon>',
  crisis: '<icon code="crisis"></icon>',
  energy: '<icon code="energy"></icon>',
  hazard: '<icon code="hazard"></icon>',
  mental: '<icon code="mental"></icon>',
  per_hero: '<icon code="perHero"></icon>',
  physical: '<icon code="physical"></icon>',
  special: '<icon code="special"></icon>',
  unique: '<icon code="unique"></icon>',
  wild: '<icon code="wild"></icon>',
});

export default {
  // strip tags and formatting
  convertToText(text: string): string {
    const formattedText = text.replace(/(<([^>]+)>)/gim, '');

    return formattedText;
  },

  iconRenderer(htmlAttributes: { code: IconCode }) {
    const { code } = htmlAttributes;

    if (IconCode[code] == null) {
      return code;
    }

    // TODO hacky way to generate a key
    const rand = Math.floor(Math.random() * 1000);

    return (
      <Icon
        code={IconCode[code]}
        key={`parser-icon-${rand}`}
        color={colors.primary}
      />
    );
  },

  replaceIconPlaceholders(text: string): string {
    let newText = text;
    Object.keys(ICON_REPLACEMENTS).forEach((key) => {
      newText = newText.replace(
        new RegExp(`\\[${key}\\]`, 'gi'),
        ICON_REPLACEMENTS[key],
      );
    });

    return newText;
  },

  replaceEmphasis(text: string): string {
    return text.replace(/\[\[([ \w]+)\]\]/gi, '<em>$1</em>');
  },

  replaceLineBreaks(text: string): string {
    return text.replace(/[\r\n]+/gi, '<br><br>');
  },
};
