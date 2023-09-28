import memoizeOne from 'memoize-one';

import { ICardRaw } from '../../data';

const cards: ICardRaw[] = [].concat(
  require('marvelsdb-json-data/pack/ant.json'),
  require('marvelsdb-json-data/pack/ant_encounter.json'),
  require('marvelsdb-json-data/pack/bkw.json'),
  require('marvelsdb-json-data/pack/bkw_encounter.json'),
  require('marvelsdb-json-data/pack/cap.json'),
  require('marvelsdb-json-data/pack/cap_encounter.json'),
  require('marvelsdb-json-data/pack/core.json'),
  require('marvelsdb-json-data/pack/core_encounter.json'),
  require('marvelsdb-json-data/pack/cyclops.json'),
  require('marvelsdb-json-data/pack/cyclops_encounter.json'),
  require('marvelsdb-json-data/pack/drax.json'),
  require('marvelsdb-json-data/pack/drax_encounter.json'),
  require('marvelsdb-json-data/pack/drs.json'),
  require('marvelsdb-json-data/pack/drs_encounter.json'),
  require('marvelsdb-json-data/pack/gam.json'),
  require('marvelsdb-json-data/pack/gam_encounter.json'),
  require('marvelsdb-json-data/pack/gambit.json'),
  require('marvelsdb-json-data/pack/gambit_encounter.json'),
  require('marvelsdb-json-data/pack/gmw.json'),
  require('marvelsdb-json-data/pack/gmw_encounter.json'),
  require('marvelsdb-json-data/pack/gob_encounter.json'),
  require('marvelsdb-json-data/pack/hlk.json'),
  require('marvelsdb-json-data/pack/hlk_encounter.json'),
  require('marvelsdb-json-data/pack/hood_encounter.json'),
  require('marvelsdb-json-data/pack/ironheart.json'),
  require('marvelsdb-json-data/pack/ironheart_encounter.json'),
  require('marvelsdb-json-data/pack/mojo_encounter.json'),
  require('marvelsdb-json-data/pack/msm.json'),
  require('marvelsdb-json-data/pack/msm_encounter.json'),
  require('marvelsdb-json-data/pack/mts.json'),
  require('marvelsdb-json-data/pack/mts_encounter.json'),
  require('marvelsdb-json-data/pack/mut_gen.json'),
  require('marvelsdb-json-data/pack/mut_gen_encounter.json'),
  require('marvelsdb-json-data/pack/nebu.json'),
  require('marvelsdb-json-data/pack/nebu_encounter.json'),
  require('marvelsdb-json-data/pack/next_evol.json'),
  require('marvelsdb-json-data/pack/next_evol_encounter.json'),
  require('marvelsdb-json-data/pack/nova.json'),
  require('marvelsdb-json-data/pack/nova_encounter.json'),
  require('marvelsdb-json-data/pack/phoenix.json'),
  require('marvelsdb-json-data/pack/phoenix_encounter.json'),
  require('marvelsdb-json-data/pack/qsv.json'),
  require('marvelsdb-json-data/pack/qsv_encounter.json'),
  require('marvelsdb-json-data/pack/rogue.json'),
  require('marvelsdb-json-data/pack/rogue_encounter.json'),
  require('marvelsdb-json-data/pack/ron_encounter.json'),
  require('marvelsdb-json-data/pack/scw.json'),
  require('marvelsdb-json-data/pack/scw_encounter.json'),
  require('marvelsdb-json-data/pack/sm.json'),
  require('marvelsdb-json-data/pack/sm_encounter.json'),
  require('marvelsdb-json-data/pack/spdr.json'),
  require('marvelsdb-json-data/pack/spdr_encounter.json'),
  require('marvelsdb-json-data/pack/spiderham.json'),
  require('marvelsdb-json-data/pack/spiderham_encounter.json'),
  require('marvelsdb-json-data/pack/stld.json'),
  require('marvelsdb-json-data/pack/stld_encounter.json'),
  require('marvelsdb-json-data/pack/storm.json'),
  require('marvelsdb-json-data/pack/storm_encounter.json'),
  require('marvelsdb-json-data/pack/thor.json'),
  require('marvelsdb-json-data/pack/thor_encounter.json'),
  require('marvelsdb-json-data/pack/toafk_encounter.json'),
  require('marvelsdb-json-data/pack/trors.json'),
  require('marvelsdb-json-data/pack/trors_encounter.json'),
  require('marvelsdb-json-data/pack/twc_encounter.json'),
  require('marvelsdb-json-data/pack/valk.json'),
  require('marvelsdb-json-data/pack/valk_encounter.json'),
  require('marvelsdb-json-data/pack/vision.json'),
  require('marvelsdb-json-data/pack/vision_encounter.json'),
  require('marvelsdb-json-data/pack/vnm.json'),
  require('marvelsdb-json-data/pack/vnm_encounter.json'),
  require('marvelsdb-json-data/pack/warm.json'),
  require('marvelsdb-json-data/pack/warm_encounter.json'),
  require('marvelsdb-json-data/pack/wolv.json'),
  require('marvelsdb-json-data/pack/wolv_encounter.json'),
  require('marvelsdb-json-data/pack/wsp.json'),
  require('marvelsdb-json-data/pack/wsp_encounter.json'),
);

export const getCardsMap = memoizeOne((): { [code: string]: ICardRaw } =>
  getCards().reduce(
    (map, card) => {
      map[card.code] = card;
      return map;
    },
    {} as { code: ICardRaw },
  ),
);

export const getCard = (code: string) => getCardsMap()[code];

export const getCardRoot = (code: string) => {
  const cardsMap = getCardsMap();
  const raw = cardsMap[code];

  if (raw?.duplicate_of && raw?.duplicate_of in cardsMap) {
    return getCardsMap()[raw.duplicate_of];
  }

  return null;
};

export const getCards = memoizeOne(() =>
  cards.map((raw) => raw).sort(compareCardCode),
);

export const compareCardCode = (a: ICardRaw, b: ICardRaw) => {
  if (a.code > b.code) {
    return 1;
  }
  if (b.code > a.code) {
    return -1;
  }
  return 0;
};
