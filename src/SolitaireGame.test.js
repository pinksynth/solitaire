const Card = require("./Card")
const {
  ACE,
  CLUB,
  DIAMOND,
  FOUR,
  HEART,
  JACK,
  KING,
  SEVEN,
  SPADE,
} = require("./constants")
const SolitaireGame = require("./SolitaireGame")
const Stack = require("./Stack")

test("starts games with a shuffled deck", () => {
  const gameDeckStrings = new Set()
  for (let x = 0; x < 100; x++) {
    const game = new SolitaireGame()
    const gameDeckString = game.deck.cards
      .map(({ rank, suit }) => `${rank}$${suit}`)
      .join(":")
    gameDeckStrings.add(gameDeckString)
  }
  // If any dupes exist, the size would be less than 100.
  expect(gameDeckStrings.size).toBe(100)
})

test("starts the game with four empty foundations", () => {
  const game = new SolitaireGame()
  for (const foundationPile of game.foundations) {
    expect(foundationPile.size()).toBe(0)
  }
})

test("can render foundations properly", () => {
  const assertionConfigs = [
    {
      expectedString: " 1H  1D  1S  1C ",
      cards: [
        [HEART, ACE],
        [DIAMOND, ACE],
        [SPADE, ACE],
        [CLUB, ACE],
      ],
    },
    {
      expectedString: "11C    13S  7H ",
      cards: [[CLUB, JACK], [], [SPADE, KING], [HEART, SEVEN]],
    },
  ]

  for (const { cards, expectedString } of assertionConfigs) {
    const game = new SolitaireGame()
    const foundations = []
    for (const [suit, rank] of cards) {
      let stackCards = []
      if (suit && rank) stackCards = [new Card({ suit, rank })]
      foundations.push(new Stack({ cards: stackCards }))
    }
    game.foundations = foundations
    expect(game.getFoundationsString()).toBe(expectedString)
  }
})

test("can render the draw pile properly", () => {
  const assertionConfigs = [
    {
      expectedString: "11H",
      cards: [
        [HEART, JACK],
        [DIAMOND, FOUR],
      ],
    },
    { expectedString: "   ", cards: [] },
  ]
  for (const { expectedString, cards } of assertionConfigs) {
    const game = new SolitaireGame()
    const stackCards = cards.map(([suit, rank]) => new Card({ rank, suit }))
    game.drawPile = new Stack({ cards: stackCards })
    expect(game.getDrawPileString()).toBe(expectedString)
  }
})

test("has 'start' function and 'availableMoves' functions", () => {
  const game = new SolitaireGame()
  game.start()
  game.availableMoves()
})
