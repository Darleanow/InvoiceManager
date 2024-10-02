const pool = require('../../config/database');

exports.createBenefit = async (req, res) => {
  try {
    const { object, unit, price_per_unit } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO invoice_manager.benefit (object, unit, price_per_unit) VALUES (?, ?, ?)',
      [object, unit, price_per_unit]
    );

    res.status(201).json({ id: result.insertId, message: "Benefit created successfully" });
  } catch (error) {
    console.error('Error creating benefit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getBenefitByInvoiceId = async (req, res) => {
  const { invoiceId } = req.params;
  try {
      const [rows] = await pool.query(`
          SELECT 
              b.id,        -- Updated to just 'id'
              b.object,    -- Updated to just 'object'
              b.unit,      -- Updated to just 'unit'
              b.price_per_unit -- Updated to just 'price_per_unit'
          FROM invoice_manager.benefit b
          JOIN invoice_manager.invoice_benefit ib ON b.id = ib.benefit_id  -- Updated to just 'id'
          WHERE ib.invoice_id = ?
      `, [invoiceId]);

      if (rows.length === 0) {
          return res.status(404).json({ message: 'No benefits found for this invoice' });
      }

      res.json(rows);
  } catch (error) {
      console.error('Error retrieving benefits for invoice:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateBenefit = async (req, res) => {
  try {
      const { id } = req.params;
      const { object, unit, price_per_unit } = req.body;

      const [result] = await pool.execute(
          'UPDATE invoice_manager.benefit SET object = ?, unit = ?, price_per_unit = ? WHERE id = ?',
          [object, unit, price_per_unit, id]
      );

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Benefit not found' });
      }

      res.status(200).json({ message: 'Benefit updated successfully' });
  } catch (error) {
      console.error('Error updating benefit:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteBenefit = async (req, res) => {
  try {
      const { id } = req.params;

      const [result] = await pool.execute('DELETE FROM invoice_manager.benefit WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Benefit not found' });
      }

      res.status(200).json({ message: 'Benefit deleted successfully' });
  } catch (error) {
      console.error('Error deleting benefit:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
};
