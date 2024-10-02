const pool = require('../../config/database');

exports.createCustomer = async (req, res) => {
    try {
        const { customer_name, customer_email, postal_address } = req.body;

        const [result] = await pool.execute(
            'INSERT INTO invoice_manager.customer (customer_name, customer_email, postal_address) VALUES (?, ?, ?)',
            [customer_name, customer_email, postal_address]
        );

        res.status(201).json({ id: result.insertId, message: "Customer created successfully" });
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCustomers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM invoice_manager.customer');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error retrieving customers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getCustomerById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM invoice_manager.customer WHERE customer_id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Error retrieving customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { customer_name, customer_email, postal_address } = req.body;

    try {
        const [result] = await pool.execute(
            'UPDATE invoice_manager.customer SET customer_name = ?, customer_email = ?, postal_address = ? WHERE customer_id = ?',
            [customer_name, customer_email, postal_address, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer updated successfully' });
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteCustomer = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.execute('DELETE FROM invoice_manager.customer WHERE customer_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
