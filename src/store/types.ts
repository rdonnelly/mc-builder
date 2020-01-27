export interface IDeck {
  code: string;
  name: string;
  setCode: string;
  aspectCode: string;
  cards: { [field: string]: number };
}
