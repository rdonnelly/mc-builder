import { Base64 } from 'js-base64';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { colors } from '@shared/styles';

import Header from '../../components/Header';

const DeckPage = () => {
  const router = useRouter();
  const [payload, setPayload] = useState('');

  const handlePayloadChange = (event) => {
    setPayload(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let encoded = null;

    if (Base64.isValid(payload)) {
      // do nothing, already base64
      encoded = payload;
    } else {
      try {
        JSON.parse(payload);
        encoded = Base64.encodeURI(payload);
      } catch (e) {
        encoded = null;
      }
    }

    if (encoded != null) {
      router.push(`/decks/${encoded}`);
    }
  };

  return (
    <>
      <Head>
        <title>{`Decks | MC Builder`}</title>
      </Head>
      <Header color={colors.purple}>Decks</Header>
      <form onSubmit={handleSubmit}>
        <input
          name="payload"
          onChange={handlePayloadChange}
          placeholder="Paste Share URL..."
          type="text"
        />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default DeckPage;
