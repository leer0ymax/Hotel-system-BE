"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_1 = require("../../src/auth/auth.service");
const db_1 = require("../../src/Drizzle/db");
const schema_1 = require("../../src/Drizzle/schema");
jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        UserTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
    transaction: jest.fn(),
}));
describe('User test service', () => {
    const mockUser = {
        user_id: 1,
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@gmail.com',
        password: 'Password123!', // Valid password that meets requirements
        role: 'user',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createUser', () => {
        it('should create a user', async () => {
            // Mock the existing user check to return null (no existing user)
            db_1.db.query.UserTable.findFirst.mockResolvedValue(null);
            // Mock the transaction function
            db_1.db.transaction.mockImplementation(async (callback) => {
                const mockTx = {
                    insert: jest.fn().mockReturnValue({
                        values: jest.fn().mockReturnValue({
                            returning: jest.fn().mockResolvedValue([mockUser])
                        })
                    })
                };
                return await callback(mockTx);
            });
            const result = await (0, auth_service_1.createAuthService)(mockUser);
            expect(result).toEqual(mockUser);
            expect(db_1.db.query.UserTable.findFirst).toHaveBeenCalled();
            expect(db_1.db.transaction).toHaveBeenCalled();
        });
    });
    describe('getAllUsers', () => {
        it('should get all users', async () => {
            db_1.db.query.UserTable.findMany.mockResolvedValue([mockUser]);
            const result = await (0, auth_service_1.getAllUsersService)();
            expect(result).toEqual([mockUser]);
            expect(db_1.db.query.UserTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getUserById', () => {
        it('should get a user by id', async () => {
            db_1.db.query.UserTable.findFirst.mockResolvedValue(mockUser);
            const result = await (0, auth_service_1.getUserByIdService)(1);
            expect(result).toEqual(mockUser);
            expect(db_1.db.query.UserTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateUser', () => {
        it('should update a user', async () => {
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockUser)
                    })
                })
            });
            const result = await (0, auth_service_1.updateUserService)(1, mockUser);
            expect(result).toEqual(mockUser);
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.UserTable);
        });
    });
    describe('deleteUser', () => {
        it('should delete a user', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockUser)
                })
            });
            const result = await (0, auth_service_1.deleteUserService)(1);
            expect(result).toEqual(mockUser);
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.UserTable);
        });
    });
});
