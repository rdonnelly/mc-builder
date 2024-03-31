import { getFactions } from '../../data/models/Faction';
import { getPacks } from '../../data/models/Pack';
import { getSets } from '../../data/models/Set';
import { getTypes } from '../../data/models/Type';
import { ICardRaw, TypeCodes } from '../../data/types';

export class Card {
  raw: ICardRaw;
  root: ICardRaw | undefined;

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
    return this?.root?.code || this?.raw?.duplicate_of || this.merged.code;
  }

  get cardCode() {
    return this.merged.code.slice(2).replace(/^0+/, '').toUpperCase();
  }

  get rootCardCode() {
    return this.rootCode.slice(2).replace(/^0+/, '').toUpperCase();
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

  get factionCode() {
    return this.merged.faction_code;
  }

  get faction() {
    return getFactions().find((f) => f.code === this.factionCode);
  }

  get factionName() {
    return (this.faction || {}).name;
  }

  get packCode() {
    return this.merged.pack_code;
  }

  get pack() {
    return getPacks().find((p) => p.code === this.packCode);
  }

  get packName() {
    return (this.pack || {}).name;
  }

  get rootPackCode() {
    return (
      this?.root?.pack_code ||
      this.merged?.root_pack_code ||
      this.merged?.pack_code
    );
  }

  get rootPack() {
    return getPacks().find((p) => p.code === this.rootPackCode);
  }

  get setCode() {
    return this.merged.set_code;
  }

  get set() {
    return getSets().find((s) => s.code === this.setCode);
  }

  get setName() {
    return (this.set || {}).name;
  }

  get typeCode() {
    return this.merged.type_code;
  }

  get type() {
    return getTypes().find((t) => t.code === this.typeCode);
  }

  get typeName() {
    return (this.type || {}).name;
  }

  get cost() {
    return this.merged.cost === -1 ? 'X' : this.merged.cost;
  }

  get flavor() {
    return this.merged.flavor;
  }

  get stage() {
    return this.merged.stage;
  }

  get attack() {
    return this.merged.attack === -1 ? 'X' : this.merged.attack;
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
    return this.merged.thwart === -1 ? 'X' : this.merged.thwart;
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
    const isDoubleSided = [TypeCodes.MAIN_SCHEME].includes(
      this.merged.type_code as TypeCodes,
    );

    if (isDoubleSided) {
      return [
        `https://cerebrodatastorage.blob.core.windows.net/cerebro-cards/official/${this.rootCode.toUpperCase()}A.jpg`,
        `https://cerebrodatastorage.blob.core.windows.net/cerebro-cards/official/${this.rootCode.toUpperCase()}B.jpg`,
      ];
    }

    return [
      `https://cerebrodatastorage.blob.core.windows.net/cerebro-cards/official/${this.rootCode.toUpperCase()}.jpg`,
    ];
  }

  get imageIsLandscape() {
    const isLandscape = [
      TypeCodes.PLAYER_SIDE_SCHEME,
      TypeCodes.MAIN_SCHEME,
      TypeCodes.SIDE_SCHEME,
    ].includes(this.merged.type_code as TypeCodes);

    return isLandscape;
  }

  get shareableUrl() {
    return `https://mcbuilder.app/cards/${this.code}`;
  }

  get meta() {
    return this.raw.meta;
  }

  get factionSetText() {
    let factionOrSetText = '';
    if (this.setName != null) {
      factionOrSetText = this.setName;
      if (this.setPosition != null) {
        const setNumbers = [];
        for (let i = 0, j = this.setQuantity; i < j; i++) {
          setNumbers.push(`#${this.setPosition + i}`);
        }
        factionOrSetText += ` (${setNumbers.join(', ')})`;
      }
    } else {
      factionOrSetText = this.factionName;
    }

    return factionOrSetText;
  }

  hasTrait(trait: string) {
    return this.traits ? this.traits.toLowerCase().includes(trait) : false;
  }
}
