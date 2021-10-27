const Stack = require("./Stack")

class TableauPile {
  constructor() {
    this.faceUpStack = new Stack({ faceUp: true })
    this.faceDownStack = new Stack({ faceUp: false })
  }

  isEmpty() {
    return this.totalSize() === 0
  }

  totalSize() {
    return this.faceDownStack.size() + this.faceUpStack.size()
  }
}

module.exports = TableauPile
