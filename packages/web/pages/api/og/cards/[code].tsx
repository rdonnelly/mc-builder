/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

import getAbsoluteUrl from '@utils/getAbsoluteUrl';

import { Card } from '@mc-builder/shared/src/data/models/Card';
import colors from '@mc-builder/shared/src/styles/colors';

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

  let card: Card;

  try {
    const rawCardResponse = await fetch(getAbsoluteUrl(`/api/cards/${code}`));
    const rawCardData = await rawCardResponse.json();
    card = new Card(rawCardData);
  } catch {
    return new ImageResponse(<>404 Not Found</>, {
      width: 1200,
      height: 630,
    });
  }

  const factionSetText =
    card.pack.name !== card.factionSetText ? ` | ${card.factionSetText}` : '';

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.zinc700,
          color: colors.zinc100,
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
              background: colors.white,
              borderRadius: 16,
              color: colors.zinc600,
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              fontFamily: 'Lato',
              fontSize: 40,
              justifyContent: 'space-between',
              lineHeight: 1.5,
              marginBottom: 32,
              padding: 16,
              width: '100%',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontFamily: 'Oswald',
                  fontSize: 80,
                  fontWeight: 'bold',
                  lineHeight: 1,
                }}
              >
                {card.name}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div>{`${card.subname || card.typeName}.`}</div>
                <div>{card.traits}</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', width: '100%' }}>
            <img
              width="96"
              height="96"
              src={getAbsoluteUrl('/images/mc-icon-76@2x.png')}
              style={{
                border: `4px solid ${colors.white}`,
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
              {`${card.pack.name} #${card.packPosition}${factionSetText}`}
            </div>
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            borderRadius: 16,
            display: 'flex',
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
              height={card.imageIsLandscape ? 275 : 566}
              style={{
                border: '4px solid white',
                borderRadius: 16,
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
