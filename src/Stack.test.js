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
test("allows cards to be placed onto the top of the stack", () => {
  const cards = [3, 4, 5, 6].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  stack.push([new Card({ rank: 8, suit: DIAMOND })])
  // Expect top of stack (end of array) to contain new element
})
