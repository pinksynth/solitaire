const Stack = require("./Stack")
const { DIAMOND } = require("./constants")
const Card = require("./Card")

test("allows cards to be taken from the top", () => {
  const cards = [3, 4, 5, 6].map((rank) => new Card({ rank, suit: DIAMOND }))
  const stack = new Stack({ cards })
  const taken = stack.take(2)

  expect(stack.cards.map(({ rank }) => rank)).toEqual([5, 6])
  expect(taken.map(({ rank }) => rank)).toEqual([3, 4])
})
