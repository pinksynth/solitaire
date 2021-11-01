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
  QUEEN,
  TWO,
  FIVE,
} = require("./constants")
const Deck = require("./Deck")
const SolitaireGame = require("./SolitaireGame")
const Stack = require("./Stack")

const newQuietGame = (opts = {}) =>
  new SolitaireGame({ gameConsole: mockConsole, ...opts })

const setFrontOfDeck = (deck, cardConfigs) => {
  for (const [rank, suit] of cardConfigs.reverse()) {
    deck.bringCardToTop({ suit, rank })
  }

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

test("has a `countCardsInTableau` function", () => {
  const game = newQuietGame()
  game.start()
  expect(game.drawPile.size()).toBe(24)
  expect(game.countCardsInTableau()).toBe(28)
})

test("allows game to be started with foundations already loaded to a given rank", () => {
  // With these 31 cards in the foundations, there will be 21 cards remaining in play (drawpile and tableau).
  const game = newQuietGame({
    loadFoundations: {
      [SPADE]: KING,
      [CLUB]: QUEEN,
      [DIAMOND]: FIVE,
      [HEART]: ACE,
    },
  })
  game.start()
  expect(game.countCardsInTableau() + game.drawPile.size()).toBe(21)
})

test("can render foundations properly", () => {
  const assertionConfigs = [
    {
      expectedString: "A♥︎ A♦︎ A♠︎ A♣︎ ",
      cards: [
        [HEART, ACE],
        [DIAMOND, ACE],
        [SPADE, ACE],
        [CLUB, ACE],
      ],
    },
    {
      expectedString: "J♣︎    K♠︎ 7♥︎ ",
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
    expect(game.getFoundationsString(false)).toBe(expectedString)
  }
})

test("can render the draw pile properly", () => {
  const assertionConfigs = [
    {
      expectedString: "J♥︎",
      cards: [
        [DIAMOND, FOUR],
        [HEART, JACK],
      ],
    },
    { expectedString: "   ", cards: [] },
  ]
  for (const { expectedString, cards } of assertionConfigs) {
    const game = newQuietGame()
    const stackCards = cards.map(([suit, rank]) => new Card({ rank, suit }))
    game.drawPile = new Stack({ cards: stackCards })
    expect(game.getDrawPileString(false)).toBe(expectedString)
  }
})

test("can use `performMove` to move an ace from tableau to foundations", () => {
  const deck = setFrontOfDeck(new Deck(), [[ACE, SPADE]])
  const game = newQuietGame({ deck })
  game.start()
  const moveIdx = game
    .availableMoves()
    .findIndex(
      (move) => move.from?.card.rank === ACE && move.from?.card.suit === SPADE
    )
  game.performMove(moveIdx)
  expect(game.foundations[0].peek()).toEqual(
    new Card({ rank: ACE, suit: SPADE })
  )
  expect(game.tableau[0].totalSize()).toBe(0)
})

test("can use `performMove` to move tableau red card N to tableau black card N + 1", () => {
  const tableauPile1 = [
    // This card will be placed on the three of diamonds
    [TWO, SPADE],
  ]
  const tableauPile2 = [
    // Ignore this card
    [FOUR, CLUB],
    [THREE, DIAMOND],
  ]
  const deckConfig = [...tableauPile1, ...tableauPile2]
  const deck = setFrontOfDeck(new Deck(), deckConfig)
  const game = newQuietGame({ deck })
  game.start()
  game.displayGame()
  const moveIdx = game
    .availableMoves()
    .findIndex(
      (move) => move.from?.card.rank === TWO && move.from?.card.suit === SPADE
    )
  game.performMove(moveIdx)
  expect(game.tableau[0].faceUpStack.peek()).toBeUndefined()
  expect(game.tableau[0].totalSize()).toBe(0)
  expect(game.tableau[1].faceUpStack.peek()).toEqual(
    new Card({ suit: SPADE, rank: TWO })
  )
  expect(game.tableau[1].totalSize()).toBe(3)
})
test.todo(
  "can use `performMove` to move tableau card with other cards on top of it"
)

const testAvailableMoves = ({ testName, getDeck, move }) =>
  test("availableMoves " + testName, () => {
    const deck = getDeck()
    const game = newQuietGame({ deck })

    game.start()
    game.displayGame()
    // Usually, our desired move will not be the only available move.
    expect(game.availableMoves()).toContainEqual(move)
  })

testAvailableMoves({
  testName: "allows user to stack red card X on black card X+1",
  getDeck: () =>
    setFrontOfDeck(new Deck(), [
      // This is the sole, face up card in tableau pile 1 (leftmost)
      // This will be placed on top of the Four of Diamonds
      [THREE, SPADE],
      // This is the face down card in tableau pile 2. Ignore this.
      [TEN, CLUB],
      // This is the face up card in tableau pile 2
      // The Three of Spades will be placed atop this.
      [FOUR, DIAMOND],
    ]),
  move: {
    from: {
      pile: { kind: "Tableau", order: 1 },
      card: new Card({ rank: THREE, suit: SPADE }),
      isTopOfStack: true,
    },
    to: {
      pile: { kind: "Tableau", order: 2 },
      card: new Card({ rank: FOUR, suit: DIAMOND }),
    },
    label: "Move 3 of Spades to 4 of Diamonds",
  },
})

testAvailableMoves({
  testName: "allows user to place an ace on an empty foundation",
  getDeck: () => setFrontOfDeck(new Deck(), [[ACE, SPADE]]),
  move: {
    from: {
      pile: { kind: "Tableau", order: 1 },
      card: new Card({ rank: ACE, suit: SPADE }),
      isTopOfStack: true,
    },
    to: {
      pile: { kind: "Foundation", order: 1 },
      card: undefined,
    },
    label: "Move Ace of Spades to Foundation 1",
  },
})
