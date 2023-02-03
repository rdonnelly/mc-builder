import Icon, { IconCode } from './Icon';
import { Text } from 'react-native';
import { Card as CardModel } from '../data/models/Card';
import { colors } from '../styles';

const getResourceIcons = (card: CardModel) => {
  const resources = card.resources;
  if (resources == null) {
    return null;
  }

  return Object.keys(resources).reduce((icons, resourceKey) => {
    if (!resources[resourceKey]) {
      return icons;
    }

    icons.push(
      ...Array(resources[resourceKey])
        .fill('')
        .map((_val, i) => (
          <Icon
            code={IconCode[resourceKey]}
            color={colors.icons[resourceKey]}
            key={`resource_icon_${resourceKey}_${i}`}
          />
        )),
    );

    return icons;
  }, [] as JSX.Element[]);
};

export default getResourceIcons;
