class Stack {
  constructor({ cards, faceUp } = {}) {
    this.cards = cards || []
    this.faceUp = faceUp === undefined ? true : faceUp
  }

  take(n = 1) {
    return new Stack({ faceUp: this.faceUp, cards: this.cards.splice(-n) })
  }

  peek() {
    return this.cards[0]
  }

  size() {
    return this.cards.length
  }
}
module.exports = Stack
