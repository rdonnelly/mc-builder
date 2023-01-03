import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components/native';

import { Card as CardModel } from '../../data/models/Card';

const CardDetailImages = ({
  card,
}: {
  card: CardModel;
  shareCardImage?: (uri: string) => void;
}) => {
  const imageUriSet = card.imageUriSet;
  const isLandscape = card.imageIsLandscape;

  return imageUriSet && imageUriSet.length ? (
    <>
      {imageUriSet.map((imageUri, i) => (
        <CardDetailImage
          key={`card_image_${card.code}_${i}`}
          imageUri={imageUri}
          isLandscape={isLandscape}
        />
      ))}
    </>
  ) : null;
};

const CardDetailImage = ({
  imageUri,
  isLandscape,
}: {
  imageUri: string;
  isLandscape: boolean;
}) => {
  const [isHidden, setHidden] = useState(false);
  const height = isLandscape ? 300 : 450;
  const width = isLandscape ? 450 : 300;

  return (
    <CardDetailImageContainer
      height={isHidden ? 0 : height}
      width={isHidden ? 0 : width}
    >
      <Image
        src={imageUri}
        layout="fill"
        objectFit="contain"
        onError={() => {
          setHidden(true);
        }}
      />
    </CardDetailImageContainer>
  );
};

const CardDetailImageContainer = styled.View<{
  height?: number;
  width?: number;
}>`
  align-self: center;
  margin-bottom: 16px;
  max-width: 100%;
  padding-horizontal: 0px;

  height: ${(props) => props.height || 0}px;
  width: ${(props) => props.width || 0}px;
`;

export default CardDetailImages;
