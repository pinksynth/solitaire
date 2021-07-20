const Card = require("./Card")
const { DIAMOND, CLUB, HEART, SPADE, VALUES } = require("./constants")
const { shuffle } = require("./util")

class Deck {
  constructor() {
    this.cards = this.generateCards()
  }

  generateCards() {
    const cards = []
    for (const suit of [HEART, DIAMOND, SPADE, CLUB]) {
      for (const rank of VALUES) {
        cards.push(new Card({ rank, suit }))
      }
    }
    return cards
  }

  shuffle() {
    shuffle(this.cards)
  }
}

module.exports = Deck
