exports.add = (req, res) => {
  const num1 = parseFloat(req.params.num1);
  const num2 = parseFloat(req.params.num2);
  const result = num1 + num2;
  res.json({ result });
};

exports.multiply = (req, res) => {
  const num1 = parseFloat(req.params.num1);
  const num2 = parseFloat(req.params.num2);
  const result = num1 * num2;
  res.json({ result });
};

exports.reverseString = (req, res) => {
  const input = req.params.input;
  const reversed = input.split('').reverse().join('');
  res.json({ reversed });
};
