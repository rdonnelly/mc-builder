/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { Base64 } from 'js-base64';
import { NextRequest } from 'next/server';

// import qrcode from 'yaqrcode';
import {
  getCardsForDeck,
  getDeckCardCount,
  getDeckHero,
  getDeckMeta,
} from '@mc-builder/shared/src/data/deckUtils';
import { Deck as DeckModel } from '@mc-builder/shared/src/data/models/Deck';
import { getFaction } from '@mc-builder/shared/src/data/models/Faction';
import { IStoreDeck, IStoreDeckCard } from '@mc-builder/shared/src/store/types';
import colors from '@mc-builder/shared/src/styles/colors';
import {
  convertImportToStoreDeckComponents,
  IImportDeck,
  isDeckJson,
  parseDeckJson,
} from '@mc-builder/shared/src/utils/DeckParser';

import getAbsoluteUrl from '../../../../utils/getAbsoluteUrl';

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

  let decoded: string = payload;
  let importDeck: IImportDeck | false = null;
  let storeDeck: IStoreDeck = null;
  let storeDeckCards: IStoreDeckCard[] = null;

  if (Base64.isValid(decoded)) {
    decoded = Base64.decode(decoded);
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
    return new ImageResponse(<>404 Not Found</>, {
      width: 1200,
      height: 630,
    });
  }

  const deck = new DeckModel(storeDeck, storeDeckCards);
  const deckCards = getCardsForDeck(storeDeckCards);

  const meta = getDeckMeta(deckCards);
  let backgroundImage = '';
  if (meta?.colors?.length === 4) {
    backgroundImage = `linear-gradient(100deg, ${meta.colors[0]} 56%, ${meta.colors[1]} 60%, ${meta.colors[2]} 100%)`;
  }

  const heroCard = getDeckHero(deck, deckCards);

  const aspects = deck.aspectCodes.map((aspectCode) => ({
    name: getFaction(aspectCode).name,
    color: colors.factions[aspectCode],
  }));

  // const linkQrData = qrcode(getAbsoluteUrl(`/decks/view?deck=${payload}`), {
  //   size: 96,
  // });

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.darkGrayDark,
          backgroundImage: backgroundImage,
          color: colors.lightGray,
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
              color: colors.darkGray,
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
                {deck.setName}
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
                <div style={{ color: colors.grayDark, display: 'flex' }}>
                  {getDeckCardCount(deckCards)} Cards
                </div>
              </div>
            </div>

            <div
              style={{
                color: colors.grayDark,
                fontFamily: 'Lato',
                fontSize: 36,
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            >
              {deck.name}
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
            {/* <img
              width="96"
              height="96"
              src={linkQrData}
              style={{
                border: `4px solid ${colors.white}`,
                borderRadius: 48,
                marginRight: 16,
              }}
            /> */}
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
            src={heroCard.imageUriSet.at(0)}
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
