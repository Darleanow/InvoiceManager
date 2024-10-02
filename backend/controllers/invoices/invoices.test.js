const pool = require('../../config/database');
const invoicesController = require('./invoices');

jest.mock('../../config/database');

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
};

const mockConnection = () => {
    return {
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
        query: jest.fn()
    };
};

const mockGetConnection = (mockQueryResults = []) => {
    const connection = mockConnection();
    mockQueryResults.forEach(result => {
        connection.query.mockResolvedValueOnce(result);
    });
    pool.getConnection.mockResolvedValue(connection);
    return connection;
};

describe('Invoices Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createInvoice should return 201 and success message', async () => {
        const req = {
            body: {
                name: 'Invoice for Health Services',
                date: '2024-10-01',
                customer_id: 1,
                benefit_ids: [1, 2]
            }
        };
        const res = mockResponse();
        const connection = mockGetConnection([[{ insertId: 1 }], [{ insertId: 1 }], [{}]]);

        await invoicesController.createInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice created successfully', invoiceId: 1 });
    });

    test('createInvoice should return 400 if required fields are missing', async () => {
        const req = {
            body: {
                name: 'Invoice for Health Services',
                date: '2024-10-01',
                customer_id: 1,
                benefit_ids: []
            }
        };
        const res = mockResponse();

        await invoicesController.createInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice name, date, customer ID, and at least one benefit ID are required' });
    });

    test('getInvoices should return invoices', async () => {
        const req = {};
        const res = mockResponse();
        pool.query.mockResolvedValue([
            [
                {
                    id: 1,
                    name: 'Invoice for Health Services',
                    date: '2024-10-01',
                    customer_id: 1,
                    customer_name: 'John Doe',
                    customer_email: 'john@example.com',
                    postal_address: '123 Main St',
                    benefit_id: 1,
                    benefit_object: 'Health Insurance',
                    benefit_unit: 12,
                    price_per_unit: 100
                }
            ]
        ]);

        await invoicesController.getInvoices(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
            id: 1,
            name: 'Invoice for Health Services',
            date: '2024-10-01',
            customer: expect.objectContaining({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                postal_address: '123 Main St'
            }),
            benefits: expect.arrayContaining([expect.objectContaining({
                id: 1,
                object: 'Health Insurance',
                unit: 12,
                price_per_unit: 100
            })])
        })]));
    });

    test('getInvoices should return 404 if no invoices found', async () => {
        const req = {};
        const res = mockResponse();

        pool.query.mockResolvedValue([[]]);

        await invoicesController.getInvoices(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No invoices found' });
    });

    test('getInvoiceById should return invoice details', async () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();

        pool.query.mockResolvedValue([
            [
                {
                    id: 1,
                    name: 'Invoice for Health Services',
                    date: '2024-10-01',
                    customer_id: 1,
                    customer_name: 'John Doe',
                    customer_email: 'john@example.com',
                    postal_address: '123 Main St',
                    benefit_id: 1,
                    benefit_object: 'Health Insurance',
                    benefit_unit: 12,
                    price_per_unit: 100
                }
            ]
        ]);

        await invoicesController.getInvoiceById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            id: 1,
            name: 'Invoice for Health Services',
            date: '2024-10-01',
            customer: expect.objectContaining({
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
                postal_address: '123 Main St'
            }),
            benefits: expect.arrayContaining([expect.objectContaining({
                id: 1,
                object: 'Health Insurance',
                unit: 12,
                price_per_unit: 100
            })])
        }));
    });

    test('getInvoiceById should return 404 if invoice not found', async () => {
        const req = { params: { id: 999 } };
        const res = mockResponse();

        pool.query.mockResolvedValue([[]]);

        await invoicesController.getInvoiceById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found' });
    });

    test('updateInvoice should return 200 on success', async () => {
        const req = {
            params: { id: 1 },
            body: {
                name: 'Updated Invoice',
                date: '2024-10-02',
                customer_id: 2,
                benefit_ids: [2]
            }
        };
        const res = mockResponse();
        const connection = mockGetConnection([[{ affectedRows: 1 }], [{}], [{}], [{}]]);

        await invoicesController.updateInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice updated successfully' });
    });

    test('updateInvoice should return 404 if invoice not found', async () => {
        const req = {
            params: { id: 999 },
            body: {
                name: 'Updated Invoice',
                date: '2024-10-02',
                customer_id: 2,
                benefit_ids: [2]
            }
        };
        const res = mockResponse();
        const connection = mockGetConnection([[{ affectedRows: 0 }]]);

        await invoicesController.updateInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found' });
    });

    test('deleteInvoice should return 200 on success', async () => {
        const req = { params: { id: 1 } };
        const res = mockResponse();
        const connection = mockGetConnection([[{}], [{}], [{ affectedRows: 1 }]]);

        await invoicesController.deleteInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice deleted successfully' });
    });

    test('deleteInvoice should return 404 if invoice not found', async () => {
        const req = { params: { id: 999 } };
        const res = mockResponse();
        const connection = mockGetConnection([[{}], [{}], [{ affectedRows: 0 }]]);

        await invoicesController.deleteInvoice(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invoice not found' });
    });
});
