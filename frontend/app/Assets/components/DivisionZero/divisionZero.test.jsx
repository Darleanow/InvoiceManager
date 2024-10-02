const divide = require("./divisionZero");

test("divide 4 / 2 to equal 2", () => {
  expect(divide(4, 2)).toBe(2);
});

test("divide by 0 crashes", () => {
  expect(() => divide(4, 0)).toThrow("Cannot divide by zero");
});
