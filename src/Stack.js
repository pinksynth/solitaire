const Card = require("./Card")

class Stack {
  constructor({ cards, faceUp } = {}) {
    this.cards = cards ? [...cards] : []

    if (this.cards.some((c) => !(c instanceof Card))) {
      throw new Error(
        'Stack constructor expected "cards" to be an array of Cards.'
      )
    }

    // Allow for-of for Stacks. There's probably a less ugly way...?
    this[Symbol.iterator] = Array.prototype[Symbol.iterator].bind(this.cards)

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

  peek() {
    return this.cards[0]
  }

  size() {
    return this.cards.length
  }

  push(cardsOrStack) {
    const cards =
      cardsOrStack instanceof Stack ? cardsOrStack.cards : cardsOrStack
    this.cards = [...this.cards, ...cards]
    return this.cards
  }

  map(...mapArgs) {
    return this.cards.map(...mapArgs)
  }
}

module.exports = Stack
