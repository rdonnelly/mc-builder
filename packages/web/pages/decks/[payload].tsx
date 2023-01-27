import { Base64 } from 'js-base64';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components/native';

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
import {
  convertImportToStoreDeckComponents,
  IImportDeck,
  isDeckJson,
  parseDeckJson,
} from '@mc-builder/shared/src/utils/DeckParser';

import Header from '../../components/Header';
import getAbsoluteUrl from '../../utils/getAbsoluteUrl';

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
  let payload = params.payload;

  if (payload === 'view') {
    payload = query.deck;
  }

  let decoded = Array.isArray(payload) ? payload.at(0) : payload;
  let importDeck: IImportDeck | false = null;
  let storeDeck: IStoreDeck = null;
  let storeDeckCards: IStoreDeckCard[] = null;

  if (Base64.isValid(decoded)) {
    decoded = Base64.decode(decoded);
  }

  if (isDeckJson(decoded)) {
    importDeck = parseDeckJson(decoded);
  }

  if (importDeck) {
    const storeDeckComponents = convertImportToStoreDeckComponents(importDeck);
    storeDeck = storeDeckComponents.storeDeck;
    storeDeckCards = storeDeckComponents.storeDeckCards;
  }

  if (!storeDeck || !storeDeckCards) {
    return {
      notFound: true,
    };
  }

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
