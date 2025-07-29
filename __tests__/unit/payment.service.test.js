"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payment_service_1 = require("../../src/payment/payment.service");
const schema_1 = require("../../src/Drizzle/schema");
const db_1 = require("../../src/Drizzle/db");
jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        PaymentTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));
describe('Payment test service', () => {
    const mockPayment = {
        payment_id: 1,
        booking_id: 1,
        amount: 100,
        payment_method: 'credit_card',
        payment_status: 'completed',
        transaction_id: 'txn_12345',
        payment_date: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createPayment', () => {
        it('should create a payment', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });
            const result = await (0, payment_service_1.createPaymentService)(mockPayment);
            expect(result).toBe(mockPayment);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
    });
    describe('getAllPayments', () => {
        it('should get all payments', async () => {
            db_1.db.query.PaymentTable.findMany.mockResolvedValue([mockPayment]);
            const result = await (0, payment_service_1.getAllPaymentsService)();
            expect(result).toEqual([mockPayment]);
            expect(db_1.db.query.PaymentTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getPaymentById', () => {
        it('should get a payment by id', async () => {
            db_1.db.query.PaymentTable.findFirst.mockResolvedValue(mockPayment);
            const result = await (0, payment_service_1.getPaymentByIdService)(1);
            expect(result).toEqual(mockPayment);
            expect(db_1.db.query.PaymentTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updatePayment', () => {
        it('should update a payment', async () => {
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockPayment)
                    })
                })
            });
            const result = await (0, payment_service_1.updatePaymentService)(1, mockPayment);
            expect(result).toEqual(mockPayment);
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
    });
    describe('deletePayment', () => {
        it('should delete a payment', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });
            const result = await (0, payment_service_1.deletePaymentService)(1);
            expect(result).toEqual(mockPayment);
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
    });
    describe('status errors', () => {
        // status 200 if payment is created successfully
        it('should return status 200 if payment is created successfully', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockPayment)
                })
            });
            const result = await (0, payment_service_1.createPaymentService)(mockPayment);
            expect(result).toBe(mockPayment);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
        // status 404 if payment is not found
        it('should return status 404 if payment is not found', async () => {
            db_1.db.query.PaymentTable.findFirst.mockResolvedValue(null);
            const result = await (0, payment_service_1.getPaymentByIdService)(999);
            expect(result).toBeNull();
            expect(db_1.db.query.PaymentTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }));
        });
        // status 400 if payment update fails
        it('should return status 400 if payment update fails', async () => {
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(null)
                    })
                })
            });
            const result = await (0, payment_service_1.updatePaymentService)(1, mockPayment);
            expect(result).toBeNull();
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
        // status 500 if payment deletion fails
        it('should return status 500 if payment deletion fails', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(null)
                })
            });
            const result = await (0, payment_service_1.deletePaymentService)(1);
            expect(result).toBeNull();
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.PaymentTable);
        });
    });
});
