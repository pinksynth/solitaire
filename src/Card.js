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
    return `${this.rank.toString().padStart(2, " ")}${this.getSuitName().substr(
      0,
      1
    )}`
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

  getColor() {
    if (this.suit === HEART || this.suit === DIAMOND) return RED
    else return BLACK
  }
}

module.exports = Card
