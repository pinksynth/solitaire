const { mockConsole } = require("../testHelpers")
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
  TEN,
  THREE,
} = require("./constants")
const Deck = require("./Deck")
const SolitaireGame = require("./SolitaireGame")
const Stack = require("./Stack")

const newQuietGame = (opts = {}) =>
  new SolitaireGame({ console: mockConsole, ...opts })

const setFrontOfDeck = (deck, cardConfigs) => {
  for (const [suit, rank] of cardConfigs.reverse()) {
    deck.bringCardToTop({ suit, rank })
  }

  // console.log("deck.length() ===== FROM setFrontOfDeck", deck.length())
  return deck
}

test("starts games with a shuffled deck", () => {
  const gameDeckStrings = new Set()
  for (let x = 0; x < 100; x++) {
    const game = newQuietGame()
    const gameDeckString = game.deck.cards
      .map(({ rank, suit }) => `${rank}$${suit}`)
      .join(":")
    gameDeckStrings.add(gameDeckString)
  }
  // If any dupes exist, the size would be less than 100.
  expect(gameDeckStrings.size).toBe(100)
})

test("starts the game with four empty foundations", () => {
  const game = newQuietGame()
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
    const game = newQuietGame()
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
    const game = newQuietGame()
    const stackCards = cards.map(([suit, rank]) => new Card({ rank, suit }))
    game.drawPile = new Stack({ cards: stackCards })
    expect(game.getDrawPileString()).toBe(expectedString)
  }
})

xtest("availableMoves allows user to stack red card X on black card X+1", () => {
  const deck = setFrontOfDeck(new Deck(), [
    // This is the sole, face up card in tableau pile 1 (leftmost)
    // This will be placed on top of the Four of Diamonds
    [SPADE, THREE],
    // This is the face down card in tableau pile 2. Ignore this.
    [CLUB, TEN],
    // This is the face up card in tableau pile 2
    // The Three of Spades will be placed atop this.
    [DIAMOND, FOUR],
  ])

  const game = new SolitaireGame({ deck })

  game.start()
  game.displayGame()
  // We assert about the first (leftmost) available move because we don't know if the rest of the tableau (piles 3-7) has other available moves.
  expect(game.availableMoves()[0]).toEqual({
    from: { pile: "Tableau 1", card: " 3S" },
    to: { pile: "Tableau 2" },
    label: "Move 3 of Spades to Tableau 2",
  })
})
