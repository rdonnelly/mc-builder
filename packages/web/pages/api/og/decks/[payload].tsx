/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

import getAbsoluteUrl from '@utils/getAbsoluteUrl';

import { getFaction } from '@mc-builder/shared/src/data/models/Faction';
import { getSet } from '@mc-builder/shared/src/data/models/Set';
import colors from '@mc-builder/shared/src/styles/colors';

export const config = {
  runtime: 'edge',
};

const fontLatoFetch = fetch(
  new URL('../../../../assets/Lato-Regular.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontLatoItalicFetch = fetch(
  new URL('../../../../assets/Lato-Italic.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

const fontOswaldFetch = fetch(
  new URL('../../../../assets/Oswald-Bold.ttf', import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [fontLato, fontLatoItalic, fontOswald] = await Promise.all([
    fontLatoFetch,
    fontLatoItalicFetch,
    fontOswaldFetch,
  ]);

  const { searchParams } = req.nextUrl;
  const payload = searchParams.get('payload');
  let rawDeckData;

  try {
    const rawDeckResponse = await fetch(
      getAbsoluteUrl(`/api/decks/${payload}`),
    );
    rawDeckData = await rawDeckResponse.json();
  } catch {
    return new ImageResponse(<>404 Not Found</>, {
      width: 1200,
      height: 630,
    });
  }

  let backgroundImage = '';
  if (rawDeckData.meta?.colors?.length === 4) {
    backgroundImage = `linear-gradient(100deg, ${rawDeckData.meta.colors[0]} 56%, ${rawDeckData.meta.colors[1]} 60%, ${rawDeckData.meta.colors[2]} 100%)`;
  }

  const set = getSet(rawDeckData.setCode);

  const aspects = rawDeckData.aspectCodes.map((aspectCode) => ({
    name: getFaction(aspectCode).name,
    color: colors.factions[aspectCode],
  }));

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.slate700,
          backgroundImage: backgroundImage,
          color: colors.slate100,
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
              color: colors.slate600,
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
                {set.name}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {aspects.map((aspect, index) => (
                  <div
                    key={index}
                    style={{ color: aspect.color, marginRight: 8 }}
                  >
                    {aspect.name}
                  </div>
                ))}
                <div style={{ color: colors.slate500, display: 'flex' }}>
                  {rawDeckData.deckCardCount} Cards
                </div>
              </div>
            </div>

            <div
              style={{
                color: colors.slate500,
                fontFamily: 'Lato',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              {rawDeckData.name}
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
          <img
            src={rawDeckData.heroImageUri}
            height="566"
            style={{
              border: '4px solid white',
              borderRadius: 16,
            }}
          />
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
          name: 'Lato',
          data: fontLatoItalic,
          weight: 400,
          style: 'italic',
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
