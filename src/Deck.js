const Card = require("./Card")
const { DIAMOND, CLUB, HEART, SPADE, VALUES } = require("./constants")

class Deck {
  constructor() {
    this.cards = this.generateCards()
    console.log("this.cards", this.cards)
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

  shuffle() {}
}

module.exports = Deck
