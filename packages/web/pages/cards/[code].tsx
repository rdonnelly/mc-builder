import Head from 'next/head';
import styled from 'styled-components/native';

import CardDetail from '@mc-builder/shared/src/components/CardDetail';
import {
  Card,
  getCard,
  getCards,
} from '@mc-builder/shared/src/data/models/Card';
import { colors } from '@mc-builder/shared/src/styles';

import Header from '../../components/Header';
import getAbsoluteUrl from '../../utils/getAbsoluteUrl';

const CardPage = ({ rawCard, meta }) => {
  const card = new Card(rawCard);

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
        <meta property="og:image" content={meta.imageUrl} />
        <meta property="og:image:secure_url" content={meta.imageUrl} />
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
  width: 100%;
`;

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const cards = getCards();

  // Get the paths we want to pre-render based on posts
  const paths = cards.map((card) => `/cards/${card.code}`);

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const code = params.code;
  const card = getCard(code);

  // Pass post data to the page via props
  return {
    props: {
      rawCard: card.raw,
      meta: {
        imageUrl: card.imageUriSet?.length ? card.imageUriSet[0] : '',
        title: card.name,
        url: getAbsoluteUrl(`/cards/${code}`),
      },
    },
  };
}

export default CardPage;
