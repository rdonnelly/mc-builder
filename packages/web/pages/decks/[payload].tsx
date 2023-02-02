import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components/native';

import Header from '@components/Header';
import getAbsoluteUrl from '@utils/getAbsoluteUrl';

import DeckDetailHeader from '@mc-builder/shared/src/components/DeckDetail/DeckDetailHeader';
import DeckDetailList from '@mc-builder/shared/src/components/DeckDetail/DeckDetailList';
import {
  getCardsForDeck,
  getDeckDescription,
  getExtraCardsForDeck,
} from '@mc-builder/shared/src/data/deckUtils';
import { Deck as DeckModel } from '@mc-builder/shared/src/data/models/Deck';
import { IStoreDeck, IStoreDeckCard } from '@mc-builder/shared/src/store/types';
import { colors } from '@mc-builder/shared/src/styles';
import { parseDeckFromString } from '@mc-builder/shared/src/utils/DeckParser';

const DeckPage = ({
  storeDeck,
  storeDeckCards,
  meta,
}: {
  storeDeck: IStoreDeck;
  storeDeckCards: IStoreDeckCard[];
  meta: any;
}) => {
  const router = useRouter();

  const deck = new DeckModel(storeDeck, storeDeckCards);
  const deckCards = getCardsForDeck(storeDeckCards);
  const extraCards = getExtraCardsForDeck(storeDeck.setCode);

  const handlePressItem = (cardCode: string) => {
    router.push(`/cards/${cardCode}`);
  };

  return (
    <>
      <Head>
        <title>{`${meta.title} | Decks | MC Builder`}</title>
        <meta property="og:url" content={meta.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={meta.ogImageUrl} />
        <meta property="og:image:secure_url" content={meta.ogImageUrl} />
      </Head>
      <Header color={colors.purple}>Decks</Header>
      <ScrollView>
        <DeckDetailWrapper>
          <DeckDetailHeader deck={deck} deckCards={deckCards} />
          <DeckDetailList
            deck={deck}
            deckCards={deckCards}
            extraCards={extraCards}
            handlePressItem={handlePressItem}
          />
        </DeckDetailWrapper>
      </ScrollView>
    </>
  );
};

const ScrollView = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const DeckDetailWrapper = styled.View`
  background: ${colors.lightGray};
  margin: 0 auto;
  max-width: 768px;
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async ({
  params,
  query,
}) => {
  let rawPayload = params.payload;

  if (rawPayload === 'view') {
    rawPayload = query.deck;
  }

  const payload = Array.isArray(rawPayload) ? rawPayload.at(0) : rawPayload;
  const parseResult = await parseDeckFromString(
    Array.isArray(payload) ? payload.at(0) : payload,
  );

  if (!parseResult || !parseResult.storeDeck || !parseResult.storeDeckCards) {
    return {
      notFound: true,
    };
  }

  const { storeDeck, storeDeckCards } = parseResult;

  const deck = new DeckModel(storeDeck, storeDeckCards);
  const deckCards = getCardsForDeck(storeDeckCards);

  return {
    props: {
      storeDeck,
      storeDeckCards,
      meta: {
        description: getDeckDescription(deck, deckCards),
        title: deck.name,
        url: getAbsoluteUrl(`/decks/view?deck=${payload}`),
        ogImageUrl: getAbsoluteUrl(`/api/og/decks/${payload}`),
      },
    },
  };
};

export default DeckPage;
