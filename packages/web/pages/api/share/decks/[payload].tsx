/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';
import qrcode from 'yaqrcode';

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
    color: colors.factions[`${aspectCode}Dark`],
  }));

  const linkQrData = qrcode(getAbsoluteUrl(`/decks/view?deck=${payload}`), {
    size: 328,
  });

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.zinc700,
          backgroundImage: backgroundImage,
          color: colors.zinc100,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          position: 'relative',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            padding: 16,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 16,
              width: '100%',
            }}
          >
            <div
              style={{
                backgroundImage: `url(${rawDeckData.heroImageUri})`,
                backgroundPosition: '-50px -40px',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '237 343',
                border: '4px solid white',
                borderRadius: 50,
                height: 100,
                width: 100,
              }}
            />
          </div>
          <div
            style={{
              alignItems: 'center',
              background: colors.white,
              borderRadius: 16,
              color: colors.zinc600,
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              lineHeight: 1,
              marginBottom: 16,
              padding: 16,
              width: '100%',
            }}
          >
            <div
              style={{
                fontFamily: 'Oswald',
                fontSize: 36,
                fontWeight: 'bold',
                maxHeight: 96,
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {rawDeckData.name}
            </div>
            <div
              style={{
                color: colors.zinc500,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {set.name}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <img
              width="60"
              height="60"
              src={getAbsoluteUrl('/images/mc-icon-60@2x.png')}
              style={{
                border: `3px solid ${colors.white}`,
                borderRadius: 30,
                marginRight: 8,
              }}
            />
            <div
              style={{
                display: 'flex',
                flex: 1,
                flexWrap: 'wrap',
                fontFamily: 'Oswald',
                fontSize: 16,
                fontWeight: 'bold',
                gap: 4,
                justifyContent: 'flex-end',
              }}
            >
              {aspects.map((aspect, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: aspect.color,
                    borderRadius: 16,
                    padding: '4px 8px',
                  }}
                >
                  {aspect.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingBottom: 16,
            width: '100%',
          }}
        >
          <img src={linkQrData} height="328" width="328" style={{}} />
        </div>
      </div>
    ),
    {
      width: 360,
      height: 720,
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
