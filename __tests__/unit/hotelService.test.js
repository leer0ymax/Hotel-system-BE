"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../../src/Drizzle/db");
const schema_1 = require("../../src/Drizzle/schema");
const hotel_service_1 = require("../../src/hotel/hotel.service");
let hotel_id;
jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        HotelTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));
describe('Hotel test service', () => {
    const mockHotel = {
        hotel_id: 1,
        name: 'Test Hotel',
        location: 'Test Location',
        address: '123 Test St',
        contact_number: '1234567890',
        category: 'Test Category',
        rating: 5,
        img_url: 'http://test.jpg',
        description: 'Test description',
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createHotel', () => {
        it('should create a hotel', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockHotel])
                })
            });
            const result = await (0, hotel_service_1.createHotelService)(mockHotel);
            expect(result).toEqual(mockHotel);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.HotelTable);
        });
    });
    describe('getHotelById', () => {
        it('should get a hotel by id', async () => {
            db_1.db.query.HotelTable.findFirst.mockResolvedValue(mockHotel);
            const result = await (0, hotel_service_1.getHotelByIdService)(1);
            expect(result).toEqual(mockHotel);
            expect(db_1.db.query.HotelTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('getAllHotels', () => {
        it('should get all hotels', async () => {
            db_1.db.query.HotelTable.findMany.mockResolvedValue([mockHotel]);
            const result = await (0, hotel_service_1.getAllHotelService)();
            expect(result).toEqual([mockHotel]);
            expect(db_1.db.query.HotelTable.findMany).toHaveBeenCalled();
        });
    });
    describe('updateHotel', () => {
        const updatedHotel = {
            ...mockHotel,
            name: 'Updated Hotel',
            location: 'Updated Location',
            address: '456 Updated St',
            contact_number: '0987654321',
            category: 'Updated Category',
            rating: 4,
            created_at: new Date(),
            updated_at: new Date(),
        };
        it('should update a hotel', async () => {
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue([updatedHotel])
                    })
                })
            });
            const result = await (0, hotel_service_1.updateHotelService)(1, updatedHotel);
            expect(result).toEqual(updatedHotel);
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.HotelTable);
        });
    });
    describe('deleteHotel', () => {
        it('should delete a hotel', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockHotel])
                })
            });
            const result = await (0, hotel_service_1.deleteHotelService)(1);
            expect(result).toEqual(mockHotel);
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.HotelTable);
        });
    });
});
