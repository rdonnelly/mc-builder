import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import { DeckModel } from '../../data';
import { colors } from '../../styles';

const DeckHeader = ({
  deck,
  onPressIdentity,
}: {
  deck: DeckModel;
  onPressIdentity?: (code: string) => void;
}) => {
  const deckCardCount = deck.cardCount;

  const [imageUris, setImageUris] = useState(null);

  useEffect(() => {
    const identityCards = deck.identityCards;
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
    ).then(() => {
      setImageUris(verifiedUris);
    });
  }, [deck]);

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
            {deck.set.name} –{' '}
            {deck.aspects.map((aspect) => aspect.name).join(', ')} –{' '}
            {`${deck.cardCount} Card${deckCardCount === 1 ? '' : 's'}`}
          </Traits>
        </TraitsWrapper>
      </Info>
    </Container>
  );
};

const Container = styled.View`
  background-color: ${colors.lightGray};
  border-bottom-color: ${colors.white};
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
  padding: 16px;
  width: 100%;
`;

const IdentityWrapper = styled.View`
  flex-direction: row;
  justify-content: center;
`;

const Identity = styled(Pressable)`
  background-color: ${colors.lightGray};
  border: 2px solid ${colors.white};
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
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.black};
  text-align: center;
`;

const TraitsWrapper = styled.View``;

const Traits = styled.Text`
  color: ${colors.grayDark};
  font-size: ${({ theme }) => theme.fontSize.label};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  text-align: center;
`;

export default DeckHeader;
