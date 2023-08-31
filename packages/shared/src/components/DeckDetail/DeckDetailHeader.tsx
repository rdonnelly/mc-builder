import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { TypeCodes } from '../../data';
import { getDeckCardCount } from '../../data/deckUtils';
import { Deck as DeckModel } from '../../data/models/Deck';
import { IDeckCard } from '../../data/models/Deck';
import { colors } from '../../styles';

const DeckDetailHeader = ({
  deck,
  deckCards,
  onPressIdentity,
}: {
  deck: DeckModel;
  deckCards: IDeckCard[];
  onPressIdentity?: (code: string) => void;
}) => {
  const deckCardCount = getDeckCardCount(deckCards);
  const deckAspectString = deck.aspects?.length
    ? `${deck.aspectNames.join(', ')} – `
    : '';

  const [imageUris, setImageUris] = useState(null);

  const identityCards = useMemo(
    () =>
      deckCards
        .filter((deckCard) =>
          [TypeCodes.ALTER_EGO, TypeCodes.HERO].includes(
            deckCard.typeCode as TypeCodes,
          ),
        )
        .map((card) => card.card)
        .sort((cardA, cardB) => cardB.typeCode.localeCompare(cardA.typeCode)),
    [deckCards],
  );

  useEffect(() => {
    const candidateUris = {};
    if (identityCards && identityCards.length) {
      identityCards.forEach((card) => {
        if (card.imageUriSet && card.imageUriSet.length) {
          candidateUris[card.code] = card.imageUriSet[0];
        }
      });
    }

    const verifiedUris = {};

    Promise.all(
      Object.keys(candidateUris).map(
        (cardCode) =>
          new Promise<void>((resolve, reject) => {
            Image.getSize(
              candidateUris[cardCode],
              () => {
                verifiedUris[cardCode] = candidateUris[cardCode];
                resolve();
              },
              () => {
                reject();
              },
            );
          }),
      ),
    )
      .then(() => {
        setImageUris(verifiedUris);
      })
      .catch(() => {});
  }, [identityCards]);

  return (
    <Container>
      {imageUris ? (
        <IdentityWrapper>
          {Object.keys(imageUris).map((cardCode) => (
            <Identity
              key={`identity_${cardCode}`}
              onPress={() =>
                onPressIdentity ? onPressIdentity(cardCode) : null
              }
            >
              <IdentityImage source={{ uri: imageUris[cardCode] }} />
            </Identity>
          ))}
        </IdentityWrapper>
      ) : null}
      <Info>
        <TitleWrapper>
          <Title>{deck.name}</Title>
        </TitleWrapper>
        <TraitsWrapper>
          <Traits>
            {deck.set.name} – {deckAspectString}
            {deckCardCount
              ? `${deckCardCount} Card${deckCardCount === 1 ? '' : 's'}`
              : null}
          </Traits>
        </TraitsWrapper>
      </Info>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${({ theme }) => theme.color.app.background};
  padding: 16px;
  width: 100%;
`;

const IdentityWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Identity = styled(Pressable)`
  background-color: ${({ theme }) => theme.color.app.background};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  height: 72px;
  margin-right: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  width: 72px;
`;

const IdentityImage = styled.Image`
  height: 132px;
  width: 132px;
  left: -50%;
`;

const Info = styled.View`
  width: 100%;
`;

const TitleWrapper = styled.View`
  margin-bottom: 8px;
`;

const Title = styled.Text`
  color: ${({ theme }) => theme.color.typography.primary};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.black};
  text-align: center;
`;

const TraitsWrapper = styled.View``;

const Traits = styled.Text`
  color: ${({ theme }) => theme.color.typography.subdued};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
`;

export default DeckDetailHeader;
