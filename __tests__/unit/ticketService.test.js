"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = require("../../src/ticket/ticket.service");
const schema_1 = require("../../src/Drizzle/schema");
const db_1 = require("../../src/Drizzle/db");
jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        CustomerSupportTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));
describe('Customer Complains Service', () => {
    const mockComplaint = {
        ticket_id: 1,
        user_id: 1,
        subject: 'Test Subject',
        description: 'Test Description',
        status: 'open',
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createComplaint', () => {
        it('should create a complaint', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockComplaint)
                })
            });
            const result = await (0, ticket_service_1.createNewComplainsService)(mockComplaint);
            expect(result).toEqual(mockComplaint);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.CustomerSupportTable);
        });
    });
    describe('getAllComplaints', () => {
        it('should get all complaints', async () => {
            db_1.db.query.CustomerSupportTable.findMany.mockResolvedValue([mockComplaint]);
            const result = await (0, ticket_service_1.getAllComplainsService)();
            expect(result).toEqual([mockComplaint]);
            expect(db_1.db.query.CustomerSupportTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getComplaintById', () => {
        it('should get a complaint by id', async () => {
            db_1.db.query.CustomerSupportTable.findFirst.mockResolvedValue(mockComplaint);
            const result = await (0, ticket_service_1.getComplainsByIdService)(1);
            expect(result).toEqual(mockComplaint);
            expect(db_1.db.query.CustomerSupportTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateComplaint', () => {
        it('should update a complaint', async () => {
            const updates = { status: 'resolved' };
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue({ ...mockComplaint, ...updates })
                    })
                })
            });
            const result = await (0, ticket_service_1.updateComplainsService)(1, updates);
            expect(result).toEqual({ ...mockComplaint, ...updates });
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.CustomerSupportTable);
        });
    });
    describe('deleteComplaint', () => {
        it('should delete a complaint', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockComplaint])
                })
            });
            const result = await (0, ticket_service_1.deleteComplainsService)(1);
            expect(result).toEqual([mockComplaint]);
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.CustomerSupportTable);
        });
    });
    describe('status errors', () => {
        // 200 if complaint is created successfully
        it('should return status 200 if complaint is created successfully', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockComplaint)
                })
            });
            const result = await (0, ticket_service_1.createNewComplainsService)(mockComplaint);
            expect(result).toEqual(mockComplaint);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.CustomerSupportTable);
        });
        // 404 if complaint is not found
        it('should return status 404 if complaint is not found', async () => {
            db_1.db.query.CustomerSupportTable.findFirst.mockResolvedValue(null);
            const result = await (0, ticket_service_1.getComplainsByIdService)(999);
            expect(result).toBeNull();
            expect(db_1.db.query.CustomerSupportTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
                where: expect.any(Function),
                columns: expect.any(Object),
            }));
        });
    });
});
