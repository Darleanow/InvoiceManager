const pool = require('../../config/database');

exports.createInvoice = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { customerName, invoiceName, dueDate, benefitIds } = req.body;

        await connection.beginTransaction();

        const [invoiceResult] = await connection.execute(
            'INSERT INTO Invoice (name, invoice_date) VALUES (?, ?)',
            [invoiceName, dueDate]
        );

        const invoiceId = invoiceResult.insertId;

        if (benefitIds && benefitIds.length > 0) {
            for (const benefitId of benefitIds) {
                await connection.execute(
                    'INSERT INTO InvoiceBenefits (invoice_id, benefit_id) VALUES (?, ?)',
                    [invoiceId, benefitId]
                );
            }
        }

        await connection.commit();

        res.status(201).json({ id: invoiceId, message: "Invoice and benefits added successfully" });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating invoice:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    };
};

exports.getInvoices = async (req, res) => {
    try {
        const [rows] = await pool.execute(`
      SELECT i.id as invoice_id, i.name as invoice_name, i.invoice_date, 
             b.id as benefit_id, b.object, b.unit, b.price_per_unit
      FROM Invoice i
      LEFT JOIN InvoiceBenefits ib ON i.id = ib.invoice_id
      LEFT JOIN Benefit b ON ib.benefit_id = b.id
    `);

        const invoices = {};
        rows.forEach(row => {
            if (!invoices[row.invoice_id]) {
                invoices[row.invoice_id] = {
                    id: row.invoice_id,
                    name: row.invoice_name,
                    invoice_date: row.invoice_date,
                    benefits: []
                };
            }

            if (row.benefit_id) {
                invoices[row.invoice_id].benefits.push({
                    id: row.benefit_id,
                    object: row.object,
                    unit: row.unit,
                    price_per_unit: row.price_per_unit
                });
            }
        });

        res.json(Object.values(invoices));
    } catch (error) {
        console.error('Error retrieving invoices:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.execute(`
          SELECT i.id as invoice_id, i.name as invoice_name, i.invoice_date, 
                 b.id as benefit_id, b.object, b.unit, b.price_per_unit
          FROM Invoice i
          LEFT JOIN InvoiceBenefits ib ON i.id = ib.invoice_id
          LEFT JOIN Benefit b ON ib.benefit_id = b.id
          WHERE i.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        const invoice = {
            id: rows[0].invoice_id,
            name: rows[0].invoice_name,
            invoice_date: rows[0].invoice_date,
            benefits: []
        };

        rows.forEach(row => {
            if (row.benefit_id) {
                invoice.benefits.push({
                    id: row.benefit_id,
                    object: row.object,
                    unit: row.unit,
                    price_per_unit: row.price_per_unit
                });
            }
        });

        res.json(invoice);
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updateInvoice = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;
        const { invoiceName, dueDate, benefitIds } = req.body;

        await connection.beginTransaction();

        const [updateResult] = await connection.execute(
            'UPDATE Invoice SET name = ?, invoice_date = ? WHERE id = ?',
            [invoiceName, dueDate, id]
        );

        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await connection.execute('DELETE FROM InvoiceBenefits WHERE invoice_id = ?', [id]);

        if (benefitIds && benefitIds.length > 0) {
            for (const benefitId of benefitIds) {
                await connection.execute(
                    'INSERT INTO InvoiceBenefits (invoice_id, benefit_id) VALUES (?, ?)',
                    [id, benefitId]
                );
            }
        }

        await connection.commit();

        res.json({ message: 'Invoice updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error updating invoice:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};


exports.deleteInvoice = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        await connection.beginTransaction();

        await connection.execute('DELETE FROM InvoiceBenefits WHERE invoice_id = ?', [id]);

        const [deleteResult] = await connection.execute('DELETE FROM Invoice WHERE id = ?', [id]);

        if (deleteResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await connection.commit();

        res.json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        await connection.rollback();
        console.error('Error deleting invoice:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        connection.release();
    }
};
