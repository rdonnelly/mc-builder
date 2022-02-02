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
    return this.root.code;
  }

  get cardCode() {
    return this.raw.code.slice(2).replace(/^0+/, '').toUpperCase();
  }

  get name() {
    return this.raw.name;
  }

  get subname() {
    return this.raw.subname;
  }

  get traits() {
    return this.raw.traits;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.raw.faction_code);
  }

  get factionCode() {
    return (this.faction || {}).code as FactionCode;
  }

  get factionName() {
    return (this.faction || {}).name;
  }

  get pack() {
    return getPacks().find((p) => p.code === this.raw.pack_code);
  }

  get packCode() {
    return (this.pack || {}).code;
  }

  get packName() {
    return (this.pack || {}).name;
  }

  get set() {
    return getSets().find((s) => s.code === this.raw.set_code);
  }

  get setCode() {
    return (this.set || {}).code;
  }

  get setName() {
    return (this.set || {}).name;
  }

  get type() {
    return getTypes().find((t) => t.code === this.raw.type_code);
  }

  get typeCode() {
    return (this.type || {}).code;
  }

  get typeName() {
    return (this.type || {}).name;
  }

  get cost() {
    return this.raw.cost;
  }

  get flavor() {
    return this.raw.flavor;
  }

  get stage() {
    return this.raw.stage;
  }

  get attack() {
    return this.raw.attack;
  }

  get attackCost() {
    return this.raw.attack_cost;
  }

  get defense() {
    return this.raw.defense;
  }

  get handSize() {
    return this.raw.hand_size;
  }

  get health() {
    return this.raw.health;
  }

  get isHealthPerHero() {
    return !!this.raw.health_per_hero;
  }

  get recover() {
    return this.raw.recover;
  }

  get scheme() {
    return this.raw.scheme;
  }

  get threat() {
    return this.raw.threat;
  }

  get threatBase() {
    return this.raw.base_threat;
  }

  get threatBaseIsFixed() {
    return this.raw.base_threat_fixed;
  }

  get threatEscalation() {
    return this.raw.escalation_threat;
  }

  get threatEscalationIsFixed() {
    return this.raw.escalation_threat_fixed;
  }

  get thwart() {
    return this.raw.thwart;
  }

  get thwartCost() {
    return this.raw.thwart_cost;
  }

  get text() {
    return this.raw.text;
  }

  get backFlavor() {
    return this.raw.back_flavor;
  }

  get backText() {
    return this.raw.back_text;
  }

  get attackText() {
    return this.raw.attack_text;
  }

  get schemeAcceleration() {
    return this.raw.scheme_acceleration;
  }

  get schemeCrisis() {
    return this.raw.scheme_crisis;
  }

  get schemeHazard() {
    return this.raw.scheme_hazard;
  }

  get schemeText() {
    return this.raw.scheme_text;
  }

  get boost() {
    return this.raw.boost;
  }

  get boostText() {
    if (this.raw.boost_text == null) {
      return null;
    }
    return `[special] <b>Boost</b>: ${this.raw.boost_text}`;
  }

  get resources() {
    if (
      !this.raw.resource_energy &&
      !this.raw.resource_mental &&
      !this.raw.resource_physical &&
      !this.raw.resource_wild
    ) {
      return null;
    }

    return {
      energy: this.raw.resource_energy,
      mental: this.raw.resource_mental,
      physical: this.raw.resource_physical,
      wild: this.raw.resource_wild,
    };
  }

  get setPosition() {
    return this.raw.set_position;
  }

  get setQuantity() {
    return this.raw.quantity;
  }

  get packPosition() {
    return this.raw.position;
  }

  get isUnique() {
    return this.raw.is_unique || false;
  }

  get deckLimit() {
    return this.raw.deck_limit || 0;
  }

  get imageUriSet() {
    const cardCode = this.raw.code.slice(2).replace(/^0+/, '').toUpperCase();
    let packUrlPart = '';
    if (this.raw.pack_code === PackCodes.RON) {
      packUrlPart = 'pnp01en';
    } else {
      const pack = getPacks().find((p) => p.code === this.raw.pack_code);
      const packCode = String(pack.position).padStart(2, '0');
      packUrlPart = `mc${packCode}en`;
    }

    const isDoubleSided = ['main_scheme'].includes(this.raw.type_code);

    if (isDoubleSided) {
      return [
        `https://marvel-champions-cards.s3.us-west-2.amazonaws.com/${packUrlPart}/${cardCode}A.png`,
        `https://marvel-champions-cards.s3.us-west-2.amazonaws.com/${packUrlPart}/${cardCode}B.png`,
      ];
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
