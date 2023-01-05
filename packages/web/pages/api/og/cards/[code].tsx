/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

import { Card } from '@mc-builder/shared/src/data/models/Card';
import { getCard, getCardRoot } from '@mc-builder/shared/src/data/raw/Card';

// import { colors } from '@mc-builder/shared/src/styles';
import getAbsoluteUrl from '../../../../utils/getAbsoluteUrl';

export const config = {
  runtime: 'edge',
};

const fontLatoFetch = fetch(
  new URL('../../../../assets/Lato-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontMarvelIconsFetch = fetch(
  new URL('../../../../assets/marvel-icons.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontOswaldFetch = fetch(
  new URL('../../../../assets/Oswald-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [fontLato, fontMarvelIcons, fontOswald] = await Promise.all([
    fontLatoFetch,
    fontMarvelIconsFetch,
    fontOswaldFetch,
  ]);

  const { searchParams } = req.nextUrl;
  const code = searchParams.get('code');

  const rawCard = getCard(code);
  const rawRoot = getCardRoot(code);

  if (!rawCard) {
    return new ImageResponse(<>404 Not Found</>, {
      width: 1200,
      height: 630,
    });
  }

  const card = new Card(rawCard, rawRoot);

  let factionOrSetText = '';
  if (card.setName != null) {
    factionOrSetText = card.setName;
    if (card.setPosition != null) {
      const setNumbers = [];
      for (let i = 0, j = card.setQuantity; i < j; i++) {
        setNumbers.push(`#${card.setPosition + i}`);
      }
      factionOrSetText += ` (${setNumbers.join(', ')})`;
    }
  } else {
    factionOrSetText = card.factionName;
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'blue',
          color: 'blue',
          display: 'flex',
          height: '100%',
          padding: 32,
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            marginRight: 16,
          }}
        >
          <div
            style={{
              fontFamily: 'Oswald',
              fontSize: 72,
              fontWeight: 'bold',
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              fontFamily: 'Oswald',
              fontSize: 42,
              fontWeight: 'bold',
              lineHeight: 1,
              marginBottom: 32,
            }}
          >
            {card.subname || card.typeName}
          </div>
          <div
            style={{
              background: 'blue',
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              fontFamily: 'Lato',
              fontSize: 32,
              justifyContent: 'space-between',
              lineHeight: 1.5,
              marginBottom: 32,
              padding: 16,
              width: '100%',
            }}
          >
            <div>{card.traits}</div>
            <div style={{ color: 'blue', fontStyle: 'italic' }}>
              {card.flavor}
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <img
              width="76"
              height="76"
              src={getAbsoluteUrl('/images/mc-icon-76.png')}
              style={{
                borderRadius: 38,
                marginRight: 16,
              }}
            />
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                flex: 1,
                fontFamily: 'Lato',
                fontSize: 32,
                height: '100%',
              }}
            >
              {`${card.pack.name} #${card.packPosition} | ${factionOrSetText}`}
            </div>
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            borderRadius: 16,
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
            marginLeft: 16,
          }}
        >
          {card.imageUriSet.map((imageUri) => (
            <img
              src={imageUri}
              style={{
                objectFit: 'contain',
                maxHeight: card.imageIsLandscape ? 275 : 566,
                maxWidth: 566,
              }}
            />
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Lato',
          data: fontLato,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'marvel-icons',
          data: fontMarvelIcons,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Oswald',
          data: fontOswald,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
