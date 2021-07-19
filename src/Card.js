const { HEART, DIAMOND, RED, BLACK } = require("./constants")

class Card {
  constructor({ suit, rank }) {
    this.suit = suit
    this.rank = rank

    if (suit === HEART || suit === DIAMOND) this.color = RED
    else this.color = BLACK
  }
}

module.exports = Card
