import React, { useEffect, useState } from 'react';
import { Image, Platform } from 'react-native';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { CardModel } from '../../data';

const CardDetailImage = ({
  card,
  imageUri,
  maxWidth,
  shareCardImage,
}: {
  card: CardModel;
  imageUri: string;
  maxWidth: number;
  shareCardImage?: (card: CardModel) => void;
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
  }, [imageUri, maxWidth]);

  if (!imageHeight || !imageWidth) {
    return null;
  }

  return (
    <Pressable
      disabled={Platform.OS !== 'ios'}
      onLongPress={() => shareCardImage(card)}
    >
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

const CardDetailImages = ({
  card,
  maxWidth,
}: {
  card: CardModel;
  maxWidth: number;
}) => {
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

const CardDetailImageContainer = styled.View<{
  height: number;
  width: number;
  pressed: boolean;
}>`
  height: ${(props) => props.height}px;
  margin-bottom: 16px;
  opacity: ${(props) => (props.pressed ? 0.9 : 1.0)};
  padding-horizontal: 0px;
  width: ${(props) => `${props.width}px`};
`;

const CardImage = styled.Image`
  height: 100%;
  width: 100%;
`;

export default CardDetailImages;
