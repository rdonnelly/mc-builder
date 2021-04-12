import { Pressable } from 'react-native';
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
  const identityCards = deck.identityCards;
  const deckCardCount = deck.cardCount;

  return (
    <Container>
      {identityCards && identityCards.length ? (
        <IdentityWrapper>
          {identityCards.map((card) =>
            card.imageUriSet != null ? (
              <Identity
                key={`identity_${card.code}`}
                onPress={() =>
                  onPressIdentity ? onPressIdentity(card.code) : null
                }
              >
                <IdentityImage source={{ uri: card.imageUriSet[0] }} />
              </Identity>
            ) : null,
          )}
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
  margin: 16px;
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
