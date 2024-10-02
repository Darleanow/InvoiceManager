const pool = require('../../config/database');

exports.createBenefit = async (req, res) => {
  try {
    const { object, unit, price_per_unit } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO Benefit (object, unit, price_per_unit) VALUES (?, ?, ?)',
      [object, unit, price_per_unit]
    );

    res.status(201).json({ id: result.insertId, message: "Benefit created successfully" });
  } catch (error) {
    console.error('Error creating benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBenefits = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM Benefit');
    res.json(rows);
  } catch (error) {
    console.error('Error retrieving benefits:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBenefitById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM Benefit WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error retrieving benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBenefit = async (req, res) => {
  try {
    const { id } = req.params;
    const { object, unit, price_per_unit } = req.body;

    const [result] = await pool.execute(
      'UPDATE Benefit SET object = ?, unit = ?, price_per_unit = ? WHERE id = ?',
      [object, unit, price_per_unit, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    res.json({ message: 'Benefit updated successfully' });
  } catch (error) {
    console.error('Error updating benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBenefit = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.execute('DELETE FROM Benefit WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Benefit not found' });
    }

    res.json({ message: 'Benefit deleted successfully' });
  } catch (error) {
    console.error('Error deleting benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
    
