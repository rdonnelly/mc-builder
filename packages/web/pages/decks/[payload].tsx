import { Base64 } from 'js-base64';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components/native';

import DeckDetailHeader from '@mc-builder/shared/src/components/DeckDetail/DeckDetailHeader';
import DeckDetailList from '@mc-builder/shared/src/components/DeckDetail/DeckDetailList';
import { DeckModel } from '@mc-builder/shared/src/data';
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
        <meta
          property="og:image"
          content={getAbsoluteUrl('/images/mc-icon-1024.png')}
        />
        <meta
          property="og:image:secure_url"
          content={getAbsoluteUrl('/images/mc-icon-1024.png')}
        />
      </Head>
      <Header color={colors.purple}>Decks</Header>
      <DeckDetailWrapper>
        <DeckDetailHeader deck={deck} />
        <DeckDetailList deck={deck} handlePressItem={handlePressItem} />
      </DeckDetailWrapper>
    </>
  );
};

const DeckDetailWrapper = styled.View`
  background: ${colors.lightGray};
  margin: 0 auto;
  max-width: 768px;
  width: 100%;
`;

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const payload = params.payload as string;

  let decoded: string = payload;
  let importDeck: IImportDeck | false = null;
  let storeDeck: IStoreDeck = null;
  let storeDeckCards: IStoreDeckCard[] = null;

  if (Base64.isValid(payload)) {
    decoded = Base64.decode(payload);
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

  return {
    props: {
      storeDeck,
      storeDeckCards,
      meta: {
        description: deck.description,
        title: deck.name,
        url: getAbsoluteUrl(`/decks/${payload}`),
      },
    },
  };
};

export default DeckPage;
