const Card = require("./Card")
const { DIAMOND, CLUB, HEART, JACK, SPADE, VALUES } = require("./constants")
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

  bringCardToTop({ suit, rank }) {
    const cardIdx = this.findCardIndex({ suit, rank })
    if (cardIdx === 51) return false
    const [card] = this.cards.splice(cardIdx, 1)
    this.cards = [...this.cards, card]
    return true
  }

  findCardIndex({ suit, rank }) {
    return this.cards.findIndex((c) => c.suit === suit && c.rank === rank)
  }

  length() {
    return this.cards.length
  }
}

module.exports = Deck
