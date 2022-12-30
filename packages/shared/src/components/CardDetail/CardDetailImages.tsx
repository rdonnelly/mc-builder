import { useEffect, useRef, useState } from 'react';
import { Image, Platform } from 'react-native';
import { Pressable } from 'react-native';
import styled from 'styled-components/native';

import { Card as CardModel } from '../../data/models/Card';

const CardDetailImages = ({
  card,
  shareCardImage,
}: {
  card: CardModel;
  shareCardImage?: (uri: string) => void;
}) => {
  const imageUriSet = card.imageUriSet;

  return imageUriSet && imageUriSet.length ? (
    <>
      {imageUriSet.map((imageUri, i) => (
        <CardDetailImage
          key={`card_image_${card.code}_${i}`}
          imageUri={imageUri}
          shareCardImage={shareCardImage}
        />
      ))}
    </>
  ) : null;
};

const CardDetailImage = ({
  imageUri,
  shareCardImage,
}: {
  imageUri: string;
  shareCardImage?: (uri: string) => void;
}) => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    Image.getSize(
      imageUri,
      (width, height) => {
        const newWidth = Math.min(width, 300);
        const newHeight = (height / width) * newWidth;

        if (isMounted.current) {
          setImageHeight(newHeight);
          setImageWidth(newWidth);
        }
      },
      () => {
        if (isMounted.current) {
          setImageHeight(null);
          setImageWidth(null);
        }
      },
    );

    return () => {
      isMounted.current = false;
    };
  }, [imageUri]);

  if (!imageHeight || !imageWidth) {
    return null;
  }

  return (
    <Pressable
      disabled={Platform.OS !== 'ios'}
      onLongPress={() => shareCardImage(imageUri)}
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

const CardDetailImageContainer = styled.View<{
  height: number;
  width: number;
  pressed: boolean;
}>`
  align-self: center;
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
