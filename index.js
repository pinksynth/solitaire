const SolitaireGame = require("./src/SolitaireGame")

const game = new SolitaireGame()
game.start()

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function dumbGame() {
  while (true) {
    await wait(1000)
    game.displayGame()
    const move = game.availableMoves()[0]
    console.log("move", move)
    if (!move) return
    game.performMove(0)
  }
}

dumbGame()
