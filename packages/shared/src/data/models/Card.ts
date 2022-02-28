import { getFactions } from '../../data/models/Faction';
import { getPacks } from '../../data/models/Pack';
import { getSets } from '../../data/models/Set';
import { getTypes } from '../../data/models/Type';
import { FactionCode, ICardRaw, PackCodes } from '../../data/types';

export class Card {
  raw: ICardRaw;
  root: ICardRaw;

  constructor(card: ICardRaw, root?: ICardRaw) {
    this.raw = card;
    this.root = root || undefined;
  }

  get code() {
    return this.raw.code;
  }

  get isDuplicate() {
    return this.raw.duplicate_of != null;
  }

  get merged(): ICardRaw {
    return {
      ...this.root,
      ...this.raw,
    };
  }

  get rootCode() {
    return this.merged.code;
  }

  get cardCode() {
    return this.merged.code.slice(2).replace(/^0+/, '').toUpperCase();
  }

  get name() {
    return this.merged.name;
  }

  get subname() {
    return this.merged.subname;
  }

  get traits() {
    return this.merged.traits;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.merged.faction_code);
  }

  get factionCode() {
    return (this.faction || {}).code as FactionCode;
  }

  get factionName() {
    return (this.faction || {}).name;
  }

  get pack() {
    return getPacks().find((p) => p.code === this.merged.pack_code);
  }

  get packCode() {
    return (this.pack || {}).code;
  }

  get packName() {
    return (this.pack || {}).name;
  }

  get set() {
    return getSets().find((s) => s.code === this.merged.set_code);
  }

  get setCode() {
    return (this.set || {}).code;
  }

  get setName() {
    return (this.set || {}).name;
  }

  get type() {
    return getTypes().find((t) => t.code === this.merged.type_code);
  }

  get typeCode() {
    return (this.type || {}).code;
  }

  get typeName() {
    return (this.type || {}).name;
  }

  get cost() {
    return this.merged.cost;
  }

  get flavor() {
    return this.merged.flavor;
  }

  get stage() {
    return this.merged.stage;
  }

  get attack() {
    return this.merged.attack;
  }

  get attackCost() {
    return this.merged.attack_cost;
  }

  get defense() {
    return this.merged.defense;
  }

  get handSize() {
    return this.merged.hand_size;
  }

  get health() {
    return this.merged.health;
  }

  get isHealthPerHero() {
    return !!this.merged.health_per_hero;
  }

  get recover() {
    return this.merged.recover;
  }

  get scheme() {
    return this.merged.scheme;
  }

  get threat() {
    return this.merged.threat;
  }

  get threatBase() {
    return this.merged.base_threat;
  }

  get threatBaseIsFixed() {
    return this.merged.base_threat_fixed;
  }

  get threatEscalation() {
    return this.merged.escalation_threat;
  }

  get threatEscalationIsFixed() {
    return this.merged.escalation_threat_fixed;
  }

  get thwart() {
    return this.merged.thwart;
  }

  get thwartCost() {
    return this.merged.thwart_cost;
  }

  get text() {
    return this.merged.text;
  }

  get backFlavor() {
    return this.merged.back_flavor;
  }

  get backText() {
    return this.merged.back_text;
  }

  get attackText() {
    return this.merged.attack_text;
  }

  get schemeAcceleration() {
    return this.merged.scheme_acceleration;
  }

  get schemeAmplify() {
    return this.merged.scheme_amplify;
  }

  get schemeCrisis() {
    return this.merged.scheme_crisis;
  }

  get schemeHazard() {
    return this.merged.scheme_hazard;
  }

  get schemeText() {
    return this.merged.scheme_text;
  }

  get boost() {
    return this.merged.boost;
  }

  get boostText() {
    if (this.merged.boost_text == null) {
      return null;
    }
    return `[special] <b>Boost</b>: ${this.merged.boost_text}`;
  }

  get resources() {
    if (
      !this.merged.resource_energy &&
      !this.merged.resource_mental &&
      !this.merged.resource_physical &&
      !this.merged.resource_wild
    ) {
      return null;
    }

    return {
      energy: this.merged.resource_energy,
      mental: this.merged.resource_mental,
      physical: this.merged.resource_physical,
      wild: this.merged.resource_wild,
    };
  }

  get setPosition() {
    return this.merged.set_position;
  }

  get setQuantity() {
    return this.merged.quantity;
  }

  get packPosition() {
    return this.merged.position;
  }

  get isUnique() {
    return this.merged.is_unique || false;
  }

  get deckLimit() {
    return this.merged.deck_limit || 0;
  }

  get imageUriSet() {
    let cardCode = this.cardCode;
    let packUrlPart = '';
    if (this.merged.pack_code === PackCodes.RON) {
      packUrlPart = 'pnp01en';
    } else {
      const pack = getPacks().find((p) => p.code === this.merged.pack_code);
      const packCode = String(pack.position).padStart(2, '0');
      packUrlPart = `mc${packCode}en`;
    }

    const isDoubleSided = ['main_scheme'].includes(this.merged.type_code);

    if (isDoubleSided) {
      return [
        `https://marvel-champions-cards.s3.us-west-2.amazonaws.com/${packUrlPart}/${cardCode}A.png`,
        `https://marvel-champions-cards.s3.us-west-2.amazonaws.com/${packUrlPart}/${cardCode}B.png`,
      ];
    }

    // Groot and Rocket Raccoon are have reverse hero/alter-ego in the set
    switch (this.code) {
      case '16001a': // Groot
        cardCode = '1B';
        break;
      case '16001b': // Groot
        cardCode = '1A';
        break;
      case '16029a': // Rocket Raccoon
        cardCode = '29B';
        break;
      case '16029b': // Rocket Raccoon
        cardCode = '29A';
        break;
    }

    return [
      `https://marvel-champions-cards.s3.us-west-2.amazonaws.com/${packUrlPart}/${cardCode}.png`,
    ];
  }

  get shareableUrl() {
    return `https://mcbuilder.app/cards/${this.code}`;
  }

  hasTrait(trait: string) {
    return this.traits ? this.traits.toLowerCase().includes(trait) : false;
  }
}
