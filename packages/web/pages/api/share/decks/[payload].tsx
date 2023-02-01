/* eslint-disable react-native/no-inline-styles, @next/next/no-img-element */
import { ImageResponse } from '@vercel/og';
import { Base64 } from 'js-base64';
import { NextRequest } from 'next/server';
import qrcode from 'yaqrcode';

import {
  getCardsForDeck,
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

  const linkQrData = qrcode(getAbsoluteUrl(`/decks/view?deck=${payload}`), {
    size: 328,
  });

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: colors.darkGrayDark,
          backgroundImage: backgroundImage,
          color: colors.lightGray,
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
                backgroundImage: `url(${heroCard.imageUriSet.at(0)})`,
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
              color: colors.darkGray,
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
              Channeling That Solo Aggression Wooooooo!
            </div>
            <div
              style={{
                color: colors.grayDark,
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              {deck.setName}
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
