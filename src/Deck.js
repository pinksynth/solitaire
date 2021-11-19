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

  bringCardToIndex({ suit, rank }, newIndex) {
    const cardIdx = this.findCardIndex({ suit, rank })
    if (cardIdx === newIndex) return false
    const [card] = this.cards.splice(cardIdx, 1)
    this.cards.splice(newIndex, 0, card)

    return true
  }

  bringCardsToIndices(cardIndexTriples) {
    const sortedTriples = [...cardIndexTriples].sort(
      ([, , newIndexA], [, , newIndexB]) => {
        return newIndexA - newIndexB
      }
    )

    // First, bring all these cards to the top of the deck to preserve the new indices.
    for (const [rank, suit] of sortedTriples) {
      this.bringCardToTop({ suit, rank })
    }
    // Then, bring the cards to the indices.
    for (const [rank, suit, newIndex] of sortedTriples) {
      this.bringCardToIndex({ suit, rank }, newIndex)
    }
  }

  bringCardToTop({ suit, rank }) {
    return this.bringCardToIndex({ suit, rank }, 51)
  }

  findCardIndex({ suit, rank }) {
    return this.cards.findIndex((c) => c.suit === suit && c.rank === rank)
  }

  length() {
    return this.cards.length
  }
}

module.exports = Deck
