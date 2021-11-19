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
  SIX,
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
      expectedString: "A♥︎  A♦︎  A♠︎  A♣︎  ",
      cards: [
        [HEART, ACE],
        [DIAMOND, ACE],
        [SPADE, ACE],
        [CLUB, ACE],
      ],
    },
    {
      expectedString: "J♣︎     K♠︎  7♥︎  ",
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
      expectedString: "J♥︎ ",
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

test("when a tableau pile has no face-up cards, the top of the face-down cards is flipped", () => {
  const tableauPile1 = [
    // Ignore this
    [ACE, CLUB],
  ]
  const tableauPile2 = [
    // This card will start out face down
    [TWO, CLUB],
    // This card will be moved to the Three of Diamonds below
    [TWO, SPADE],
  ]
  const tableauPile3 = [
    // Ignore this card (face down)
    [THREE, CLUB],
    // Ignore this card (face down)
    [FOUR, CLUB],
    [THREE, DIAMOND],
  ]
  const deckConfig = [...tableauPile1, ...tableauPile2, ...tableauPile3]
  const deck = setFrontOfDeck(new Deck(), deckConfig)
  const game = new SolitaireGame({ deck })
  game.start()
  // Move the Two of Spades onto the Three of Diamonds
  const firstMoveIdx = game
    .availableMoves()
    .findIndex(
      (move) => move.from?.card.rank === TWO && move.from?.card.suit === SPADE
    )
  game.performMove(firstMoveIdx)
  expect(game.tableau[1].faceUpStack.peek()).toEqual(
    new Card({ rank: TWO, suit: CLUB })
  )
  expect(game.tableau[1].totalSize()).toBe(1)
})

test("can use `performMove` to move tableau card with other cards on top of it", () => {
  const tableauPile1 = [
    // First, this card will be placed on the three of diamonds
    [TWO, SPADE],
  ]
  const tableauPile2 = [
    // Ignore this card (face down)
    [FOUR, CLUB],
    // Once this three of diamonds has a Two of Spades on it, we'll move it to the Four of Spades.
    [THREE, DIAMOND],
  ]
  const tableauPile3 = [
    // Ignore this card (face down)
    [FIVE, CLUB],
    // Ignore this card (face down)
    [SIX, CLUB],
    [FOUR, SPADE],
  ]
  const deckConfig = [...tableauPile1, ...tableauPile2, ...tableauPile3]
  const deck = setFrontOfDeck(new Deck(), deckConfig)
  const game = newQuietGame({ deck })
  game.start()
  // First, move the Two of Spades onto the Three of Diamonds
  const firstMoveIdx = game
    .availableMoves()
    .findIndex(
      (move) => move.from?.card.rank === TWO && move.from?.card.suit === SPADE
    )
  game.performMove(firstMoveIdx)
  // Then, move the Three of Diamonds onto the Four of Spades
  const secondMoveIdx = game
    .availableMoves()
    .findIndex(
      (move) =>
        move.from?.card.rank === THREE && move.from?.card.suit === DIAMOND
    )
  game.performMove(secondMoveIdx)
  expect(game.tableau[0].faceUpStack.peek()).toBeUndefined()
  expect(game.tableau[0].totalSize()).toBe(0)
  expect(game.tableau[1].faceUpStack.peek()).toEqual(
    new Card({ suit: CLUB, rank: FOUR })
  )
  expect(game.tableau[1].totalSize()).toBe(1)
  expect(game.tableau[2].faceUpStack.map((c) => [c.rank, c.suit])).toEqual([
    [FOUR, SPADE],
    [THREE, DIAMOND],
    [TWO, SPADE],
  ])
  expect(game.tableau[2].faceDownStack.size()).toBe(2)
})

test("can use `performMove` to move draw pile card to the tableau", () => {
  const deck = new Deck()
  deck.bringCardsToIndices([
    [FOUR, SPADE, 51], // Far left of tableau
    [THREE, HEART, 23], // Top of drawpile
  ])
  const game = newQuietGame({ deck })
  game.start()
  // Move the Three of Hearts onto the Four of Spades
  const moveIdx = game
    .availableMoves()
    .findIndex(
      (move) => move.from?.card.rank === THREE && move.from?.card.suit === HEART
    )
  game.performMove(moveIdx)
  expect(game.tableau[0].totalSize()).toBe(2)
  expect(game.tableau[0].faceUpStack.peek()).toEqual(
    new Card({ suit: HEART, rank: THREE })
  )
})
test.todo("can use `performMove` to move draw pile card to the foundations")

const testAvailableMoves = ({ testName, getDeck, move }) =>
  test("availableMoves " + testName, () => {
    const deck = getDeck()
    const game = newQuietGame({ deck })

    game.start()
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
