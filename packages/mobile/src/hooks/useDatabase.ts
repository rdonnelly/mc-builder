// @ts-ignore
import { MCBUILDER_BASE_URI } from '@env';
import NetInfo from '@react-native-community/netinfo';
import { useCallback, useState } from 'react';

import {
  fetchDeckCardsFromDatabase,
  fetchEligibleDeckCardsFromDatabase,
} from '@utils/deckUtils';

import Database from '@mc-builder/mobile/src/utils/Database';
import {
  CardModel,
  FactionCode,
  FilterCode,
  PackCode,
  SetCode,
  TypeCode,
} from '@mc-builder/shared/src/data';
import {
  CardSortTypes,
  IFactionRaw,
  IPackRaw,
  ISetRaw,
  ITypeRaw,
} from '@mc-builder/shared/src/data/types';
import { IStoreDeckCard } from '@mc-builder/shared/src/store/types';

interface IUseDatabaseState {
  cardsAnnotated: any[];
  isFetching: boolean;
  isSyncing: boolean;
  didSync: boolean;
}

export function useDatabase() {
  const [state, setState] = useState<IUseDatabaseState>({
    cardsAnnotated: [],
    isFetching: false,
    isSyncing: false,
    didSync: null,
  });

  const checkDatabase = useCallback(async () => {
    const didSync = await Database.check();
    setState((prevState) => ({ ...prevState, didSync: didSync }));
    return didSync;
  }, []);

  const syncCardData = useCallback(async () => {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      return false;
    }

    setState((prevState) => ({ ...prevState, isSyncing: true }));

    const [factionsResponse, packsResponse, setsResponse, typesResponse] =
      await Promise.all([
        fetch(`${MCBUILDER_BASE_URI}/api/aspects`),
        fetch(`${MCBUILDER_BASE_URI}/api/packs`),
        fetch(`${MCBUILDER_BASE_URI}/api/sets`),
        fetch(`${MCBUILDER_BASE_URI}/api/types`),
      ]);

    const factions: IFactionRaw[] = await factionsResponse.json();
    const packs: IPackRaw[] = await packsResponse.json();
    const sets: ISetRaw[] = await setsResponse.json();
    const types: ITypeRaw[] = await typesResponse.json();

    const cards = [];

    for (const pack of packs) {
      const cardsResponse = await fetch(
        `${MCBUILDER_BASE_URI}/api/packs/${pack.code}/cards`,
      );
      const packCards = await cardsResponse.json();
      cards.push(
        ...packCards.map((card) => {
          return {
            code: card.code,
            duplicate_of: card.duplicate_of || null,
            name: card.name,

            faction_code: card.faction_code,
            pack_code: card.pack_code,
            set_code: card.set_code || null,
            type_code: card.type_code,

            deck_limit: card.deck_limit != null ? card.deck_limit : null,
            position: card.position,
            quantity: card.quantity,
            set_position: card.set_position != null ? card.set_position : null,

            back_flavor: card.back_flavor || null,
            back_text: card.back_text || null,
            double_sided: card.double_sided || false,
            flavor: card.flavor || null,
            illustrator: card.illustrator || null,
            is_unique: card.is_unique || false,
            permanent: card.permanent || false,
            subname: card.subname || null,
            text: card.text || null,
            traits: card.traits || null,

            cost: card.cost != null ? card.cost : null,
            resource_energy: card.resource_energy || null,
            resource_mental: card.resource_mental || null,
            resource_physical: card.resource_physical || null,
            resource_wild: card.resource_wild || null,

            attack_cost: card.attack_cost != null ? card.attack_cost : null,
            attack_text: card.attack_text || null,
            attack: card.attack != null ? card.attack : null,
            defense: card.defense != null ? card.defense : null,
            hand_size: card.hand_size != null ? card.hand_size : null,
            health_per_hero:
              card.health_per_hero != null ? card.health_per_hero : null,
            health: card.health != null ? card.health : null,
            recover: card.recover != null ? card.recover : null,
            scheme_acceleration: card.scheme_acceleration || false,
            scheme_amplify: card.scheme_amplify || false,
            scheme_crisis: card.scheme_crisis || false,
            scheme_hazard: card.scheme_hazard || false,
            scheme_text: card.scheme_text || null,
            scheme: card.scheme || null,
            stage: card.stage != null ? card.stage : null,
            thwart_cost: card.thwart_cost != null ? card.thwart_cost : null,
            thwart: card.thwart != null ? card.thwart : null,

            base_threat_fixed:
              card.base_threat_fixed != null ? card.base_threat_fixed : null,
            base_threat: card.base_threat != null ? card.base_threat : null,
            boost_text: card.boost_text || null,
            boost: card.boost != null ? card.boost : null,
            escalation_threat_fixed:
              card.escalation_threat_fixed != null
                ? card.escalation_threat_fixed
                : null,
            escalation_threat:
              card.escalation_threat != null ? card.escalation_threat : null,
            threat: card.threat != null ? card.threat : null,
          };
        }),
      );
    }

    cards.sort(function (a, b) {
      var codeA = a.code.toUpperCase();
      var codeB = b.code.toUpperCase();
      if (codeA < codeB) {
        return -1;
      }
      if (codeA > codeB) {
        return 1;
      }

      return 0;
    });

    await Database.dropTables();
    await Database.createTables();
    await Database.populateTables({ factions, packs, sets, types, cards });

    setState((prevState) => ({ ...prevState, isSyncing: false }));

    return true;

    // TODO close database?
  }, []);

  const fetchCards = useCallback(
    async ({
      searchString,
      filter,
      filterCode,
      sort,
    }: {
      searchString?: string;
      filter?: FilterCode;
      filterCode?: (FactionCode | PackCode | SetCode | TypeCode)[];
      sort?: CardSortTypes;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const rawCards = await Database.fetchCards({
        searchString,
        filter,
        filterCode,
        sort,
      });

      const newCards = rawCards.map((rawCard) => {
        const cardObject = new CardModel(rawCard);
        return {
          card: cardObject,
          code: rawCard.code,
          name: rawCard.name,
          factionCode: rawCard.factionCode,
          setCode: rawCard.setCode,
          typeCode: rawCard.typeCode,
        };
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: newCards,
        isFetching: false,
      }));
    },
    [],
  );

  const fetchDeckCards = useCallback(
    async ({
      setCode,
      storeDeckCards,
      sort,
    }: {
      setCode: SetCode;
      storeDeckCards: IStoreDeckCard[];
      sort?: CardSortTypes;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const { deckCards, deckExtraCards } = await fetchDeckCardsFromDatabase({
        setCode,
        storeDeckCards,
        sort,
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: [].concat(deckCards, deckExtraCards),
        isFetching: false,
      }));
    },
    [],
  );

  const fetchEligibleDeckCards = useCallback(
    async ({
      factionCodes,
      setCode,
    }: {
      factionCodes: FactionCode[];
      setCode: SetCode;
    }) => {
      setState((prevState) => ({ ...prevState, isFetching: true }));

      const eligibleDeckCards = await fetchEligibleDeckCardsFromDatabase({
        factionCodes,
        setCode,
      });

      setState((prevState) => ({
        ...prevState,
        cardsAnnotated: eligibleDeckCards,
        isFetching: false,
      }));
    },
    [],
  );

  return {
    didSync: state.didSync,
    isSyncing: state.isSyncing,
    checkDatabase,
    syncCardData,

    isFetching: state.isFetching,
    fetchCards,
    fetchDeckCards,
    fetchEligibleDeckCards,

    cardsAnnotated: state.cardsAnnotated,
  };
}
