/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

import { Card } from '@mc-builder/shared/src/data/models/Card';
import { getCard, getCardRoot } from '@mc-builder/shared/src/data/raw/Card';
import colors from '@mc-builder/shared/src/styles/colors';

import getAbsoluteUrl from '../../../../utils/getAbsoluteUrl';

export const config = {
  runtime: 'edge',
};

const fontLatoFetch = fetch(
  new URL('../../../../assets/Lato-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontOswaldFetch = fetch(
  new URL('../../../../assets/Oswald-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [fontLato, fontOswald] = await Promise.all([
    fontLatoFetch,
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
          background: colors.lightGray,
          color: colors.darkGray,
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
              fontSize: 80,
              fontWeight: 'bold',
              lineHeight: 1,
              marginBottom: 32,
            }}
          >
            {card.name}
          </div>
          <div
            style={{
              background: colors.white,
              borderRadius: 16,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              fontFamily: 'Lato',
              fontSize: 32,
              lineHeight: 1.5,
              marginBottom: 32,
              padding: 16,
              width: '100%',
            }}
          >
            <div
              style={{
                fontFamily: 'Oswald',
                fontSize: 42,
                fontWeight: 'bold',
                lineHeight: 1,
                marginBottom: 16,
              }}
            >
              {card.subname || card.typeName}
            </div>
            <div>{card.traits}</div>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <img
              width="96"
              height="96"
              src={getAbsoluteUrl('/images/mc-icon-76@2x.png')}
              style={{
                borderRadius: 48,
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
          {card.imageUriSet.map((imageUri, index) => (
            <img
              key={index}
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
          name: 'Oswald',
          data: fontOswald,
          weight: 700,
          style: 'normal',
        },
      ],
    },
  );
}
