// The Mnemonica stack (Juan Tamariz), positions 1-52.
// Each card is encoded as rank + suit letter.
// Ranks: A, 2-10, J, Q, K.  Suits: S(♠), H(♥), D(♦), C(♣).

export type Suit = "S" | "H" | "D" | "C";

export interface Card {
  rank: string;
  suit: Suit;
}

const RAW_STACK = [
  "4C", "2H", "7D", "3C", "4H", "6D", "AS", "5H", "9S", "2S",
  "QH", "3D", "QC", "8H", "6S", "5S", "9H", "KC", "2D", "JH",
  "3S", "8S", "6H", "10C", "5D", "KD", "2C", "3H", "8D", "5C",
  "KS", "JD", "8C", "10S", "KH", "JC", "7S", "10H", "AD", "4S",
  "7H", "4D", "AC", "9C", "JS", "QD", "7C", "QS", "10D", "6C",
  "AH", "9D",
] as const;

export const SUIT_SYMBOL: Record<Suit, string> = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

export const SUIT_NAME: Record<Suit, string> = {
  S: "Spades",
  H: "Hearts",
  D: "Diamonds",
  C: "Clubs",
};

export const RANK_NAME: Record<string, string> = {
  A: "Ace",
  J: "Jack",
  Q: "Queen",
  K: "King",
};

function parse(code: string): Card {
  const suit = code.slice(-1) as Suit;
  const rank = code.slice(0, -1);
  return { rank, suit };
}

// STACK[0] is position 1.
export const STACK: Card[] = RAW_STACK.map(parse);

export function cardAtPosition(position: number): Card {
  return STACK[position - 1];
}

export function positionOfCard(card: Card): number {
  return (
    STACK.findIndex((c) => c.rank === card.rank && c.suit === card.suit) + 1
  );
}

export function isRed(suit: Suit): boolean {
  return suit === "H" || suit === "D";
}

export function cardLabel(card: Card): string {
  const rankName = RANK_NAME[card.rank] ?? card.rank;
  return `${rankName} of ${SUIT_NAME[card.suit]}`;
}

export function cardCode(card: Card): string {
  return `${card.rank}${SUIT_SYMBOL[card.suit]}`;
}
