const Stack = require("./Stack")
const { DIAMOND } = require("./constants")
const Card = require("./Card")

test("allows cards to be taken from the top as a new stack", () => {
  const cards = [3, 4, 5, 6].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  const taken = stack.take(2)

  expect(stack.cards.map(({ rank }) => rank)).toEqual([3, 4])
  expect(taken.cards.map(({ rank }) => rank)).toEqual([5, 6])
})

test("allows cards to be taken up to (and including) a given card", () => {
  const cards = [1, 2, 3, 4, 5].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  const taken = stack.takeTopOfStackFromCard({ rank: 3, suit: DIAMOND })
  expect(stack.cards.map(({ rank }) => rank)).toEqual([1, 2])
  expect(taken.cards.map(({ rank }) => rank)).toEqual([3, 4, 5])
})

test("allows cards to be placed onto the top of the stack", () => {
  const cards = [3, 4, 5, 6].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  // Array of Cards as argument
  stack.push([new Card({ rank: 8, suit: DIAMOND })])
  expect(stack.map((c) => c.rank).join(" ")).toBe("3 4 5 6 8")
  // Stack as argument
  stack.push(new Stack({ cards: [new Card({ rank: 9, suit: DIAMOND })] }))
  expect(stack.map((c) => c.rank).join(" ")).toBe("3 4 5 6 8 9")
})

test("allows the top card to be peeked", () => {
  const cards = [1, 2, 3].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  expect(stack.peek()).toEqual(new Card({ rank: 3, suit: DIAMOND }))
})

test("allows cycleCard to be used to move the top card to the bottom", () => {
  const cards = [3, 4, 5, 6].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  stack.cycleCard()
  expect(stack.map((c) => c.rank).join(" ")).toBe("6 3 4 5")
  stack.cycleCard()
  expect(stack.map((c) => c.rank).join(" ")).toBe("5 6 3 4")
})
