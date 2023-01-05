import Head from 'next/head';
import styled from 'styled-components/native';

import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import { Card } from '@mc-builder/shared/src/data/models/Card';
import {
  getCard,
  getCardRoot,
  getCards,
} from '@mc-builder/shared/src/data/raw/Card';
import { colors } from '@mc-builder/shared/src/styles';

import Header from '../../components/Header';
import getAbsoluteUrl from '../../utils/getAbsoluteUrl';

const CardPage = ({ rawCard, rootCard, meta }) => {
  const card = new Card(rawCard, rootCard);

  return (
    <>
      <Head>
        <title>{`${meta.title} | MC Builder`}</title>
        <meta property="og:url" content={meta.url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        <meta
          property="og:description"
          content="MC Builder: the premier mobile deck builder and card browser for one of our favorite games"
        />

        <meta
          name="og:image"
          content={getAbsoluteUrl(`/api/og/cards/${card.code}`)}
        />
        <meta
          name="og:image:secure_url"
          content={getAbsoluteUrl(`/api/og/cards/${card.code}`)}
        />
      </Head>

      <Header color={colors.orange}>Cards</Header>
      <CardDetailWrapper>
        <CardDetail card={card} />
      </CardDetailWrapper>
    </>
  );
};

const CardDetailWrapper = styled.View`
  margin: 0 auto;
  max-width: 768px;
  padding: 0 8px;
  width: 100%;
`;

export async function getStaticPaths() {
  const cards = getCards();
  const paths = cards.map((card) => `/cards/${card.code}`);

  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const code = params.code;
  const rawCard = getCard(code);
  const rootCard = getCardRoot(code);
  const card = new Card(rawCard, rootCard);

  return {
    props: {
      rawCard: rawCard,
      rootCard: rootCard,
      meta: {
        imageUrl: card.imageUriSet?.length ? card.imageUriSet[0] : '',
        title: card.name,
        url: getAbsoluteUrl(`/cards/${code}`),
      },
    },
  };
}

export default CardPage;
