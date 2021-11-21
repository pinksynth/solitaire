const Card = require("./Card")

class Stack {
  constructor({ cards, faceUp } = {}) {
    this.cards = cards ? [...cards] : []

    if (this.cards.some((c) => !(c instanceof Card))) {
      throw new Error(
        'Stack constructor expected "cards" to be an array of Cards.'
      )
    }

    // FIXME: When "this.cards" is redefined as a new array, this Symbol.iterator points to the wrong object. How are you supposed to fix this? For now just using forEach
    // Allow for-of for Stacks. There's probably a less ugly way...?
    // this[Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.cards)

    this.faceUp = faceUp === undefined ? true : faceUp
  }

  take(takeCount = 1) {
    let cards
    // Prevent splice(0)
    if (takeCount > 0) {
      const spliceIdx = -takeCount
      cards = this.cards.splice(spliceIdx)
    } else {
      cards = []
    }
    return new Stack({ faceUp: this.faceUp, cards })
  }

  takeTopOfStackFromCard({ suit, rank }) {
    const cardIdx = this.findCardIndex({ suit, rank })
    // Card does not exist in this Stack
    if (cardIdx === -1) return false
    const newStack = this.cards.splice(cardIdx)
    return new Stack({ faceUp: this.faceUp, cards: newStack })
  }

  peek() {
    return this.cards[this.cards.length - 1]
  }

  size() {
    return this.cards.length
  }

  push(pushable) {
    let cards
    if (pushable instanceof Stack) {
      cards = pushable.cards
    } else if (Array.isArray(pushable)) {
      cards = pushable
    } else if (pushable instanceof Card) {
      cards = [pushable]
    }
    this.cards = [...this.cards, ...cards]
    return this.cards
  }

  map(...mapArgs) {
    return this.cards.map(...mapArgs)
  }

  forEach(...forEachArgs) {
    return this.cards.forEach(...forEachArgs)
  }

  // TODO: Deck and Stack both have this and it works the same way, so it should probably be inherited.
  bringCardToTop({ suit, rank }) {
    const cardIdx = this.findCardIndex({ suit, rank })
    // Card does not exist in this Stack
    if (cardIdx === -1) return false
    // Card is already at top
    if (cardIdx === this.cards.length - 1) return false
    const [card] = this.cards.splice(cardIdx, 1)
    this.cards = [...this.cards, card]
    return true
  }

  findCardIndex({ suit, rank }) {
    return this.cards.findIndex((c) => c.suit === suit && c.rank === rank)
  }

  getCard(index) {
    return this.cards[index]
  }

  cycleCard() {
    const top = this.cards.pop()
    this.cards = [top, ...this.cards]
  }
}

module.exports = Stack
