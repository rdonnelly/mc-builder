import Head from 'next/head';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

import Header from '@components/Header';
import getAbsoluteUrl from '@utils/getAbsoluteUrl';

import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import { Card } from '@mc-builder/shared/src/data/models/Card';
import {
  getCard,
  getCardRoot,
  getCards,
} from '@mc-builder/shared/src/data/raw/Card';

const CardPage = ({ rawCard, rootCard, meta }) => {
  const card = new Card(rawCard, rootCard);

  const theme = useTheme();

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

        <meta name="og:image" content={meta.ogImageUrl} />
        <meta name="og:image:secure_url" content={meta.ogImageUrl} />
      </Head>
      <Header color={theme.color.app.brand.cards}>Cards</Header>
      <ScrollView>
        <CardDetailWrapper>
          <CardDetail card={card} />
        </CardDetailWrapper>
      </ScrollView>
    </>
  );
};

const ScrollView = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

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
        title: card.name,
        url: getAbsoluteUrl(`/cards/${code}`),
        ogImageUrl: getAbsoluteUrl(`/api/og/cards/${code}`),
      },
    },
  };
}

export default CardPage;
