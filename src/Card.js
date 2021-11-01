const inspect = Symbol.for("nodejs.util.inspect.custom")

const {
  ACE,
  BLACK,
  CLUB,
  DIAMOND,
  HEART,
  JACK,
  KING,
  QUEEN,
  RED,
  SPADE,
} = require("./constants")

class Card {
  constructor({ suit, rank }) {
    this.suit = suit
    this.rank = rank
  }

  getShortName() {
    return `${this.getOrdinalName().substr(0, 1)}${this.getSuitSymbol()} `
  }

  getName() {
    return `${this.getOrdinalName()} of ${this.getSuitName()}`
  }

  getOrdinalName() {
    switch (this.rank) {
      case ACE:
        return "Ace"
      case JACK:
        return "Jack"
      case QUEEN:
        return "Queen"
      case KING:
        return "King"
      default:
        return `${this.rank}`
    }
  }

  getSuitName() {
    switch (this.suit) {
      case HEART:
        return "Hearts"
      case DIAMOND:
        return "Diamonds"
      case CLUB:
        return "Clubs"
      case SPADE:
        return "Spades"
    }
  }

  getSuitSymbol() {
    switch (this.suit) {
      case HEART:
        return "♥︎"
      case DIAMOND:
        return "♦︎"
      case CLUB:
        return "♣︎"
      case SPADE:
        return "♠︎"
    }
  }

  getColor() {
    if (this.suit === HEART || this.suit === DIAMOND) return RED
    else return BLACK
  }

  isSameCard({ suit, rank }) {
    return suit === this.suit && rank === this.rank
  }

  [inspect]() {
    return this.getName()
  }
}

module.exports = Card
