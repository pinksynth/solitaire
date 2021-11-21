const SolitaireGame = require("./src/SolitaireGame")

const game = new SolitaireGame()
game.start()

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function dumbGame() {
  while (!game.isComplete) {
    await wait(5)
    console.clear()
    game.displayGame()
    const randomIdx = Math.floor(Math.random() * game.availableMoves().length)
    game.performMove(randomIdx)
  }
  console.clear()
  game.displayGame()
  console.log("Congration! You done it!")
}

dumbGame()
