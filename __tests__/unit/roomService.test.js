"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const room_service_1 = require("../../src/room/room.service");
const schema_1 = require("../../src/Drizzle/schema");
const db_1 = require("../../src/Drizzle/db");
jest.mock('../../src/Drizzle/db', () => ({
    insert: jest.fn(),
    query: {
        RoomTable: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
        }
    },
    update: jest.fn(),
    delete: jest.fn(),
}));
describe('Room Service', () => {
    const mockRoom = {
        room_id: 1,
        hotel_id: 1,
        room_type: 'Deluxe',
        room_number: '101',
        price_per_night: 100,
        amenities: 'WiFi, TV, AC',
        capacity: 2,
        img_url: "https://example.com/image.jpg",
        description: "Spacious deluxe room with all amenities",
        availability: 'available',
        created_at: new Date(),
        updated_at: new Date(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createRoom', () => {
        it('should create a room', async () => {
            db_1.db.insert.mockReturnValue({
                values: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockRoom)
                })
            });
            const result = await (0, room_service_1.createRoomService)(mockRoom);
            expect(result).toEqual(mockRoom);
            expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.RoomTable);
        });
    });
    describe('getAllRooms', () => {
        it('should get all rooms', async () => {
            db_1.db.query.RoomTable.findMany.mockResolvedValue([mockRoom]);
            const result = await (0, room_service_1.getAllRoomsService)();
            expect(result).toEqual([mockRoom]);
            expect(db_1.db.query.RoomTable.findMany).toHaveBeenCalled();
        });
    });
    describe('getRoomById', () => {
        it('should get a room by id', async () => {
            db_1.db.query.RoomTable.findFirst.mockResolvedValue(mockRoom);
            const result = await (0, room_service_1.getRoomByIdService)(1);
            expect(result).toEqual(mockRoom);
            expect(db_1.db.query.RoomTable.findFirst).toHaveBeenCalled();
        });
    });
    describe('updateRoom', () => {
        it('should update a room', async () => {
            db_1.db.update.mockReturnValue({
                set: jest.fn().mockReturnValue({
                    where: jest.fn().mockReturnValue({
                        returning: jest.fn().mockResolvedValue(mockRoom)
                    })
                })
            });
            const result = await (0, room_service_1.updateRoomService)(1, mockRoom);
            expect(result).toEqual(mockRoom);
            expect(db_1.db.update).toHaveBeenCalledWith(schema_1.RoomTable);
        });
    });
    describe('deleteRoom', () => {
        it('should delete a room', async () => {
            db_1.db.delete.mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue(mockRoom)
                })
            });
            const result = await (0, room_service_1.deleteRoomService)(1);
            expect(result).toEqual(mockRoom);
            expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.RoomTable);
        });
    });
    it('should throw an error if room creation fails', async () => {
        db_1.db.insert.mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockRejectedValue(new Error('Database error'))
            })
        });
        await expect((0, room_service_1.createRoomService)(mockRoom)).rejects.toThrow('Database error');
    });
    // 200 if room is created successfully
    it('should return status 200 if room is created successfully', async () => {
        db_1.db.insert.mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue(mockRoom)
            })
        });
        const result = await (0, room_service_1.createRoomService)(mockRoom);
        expect(result).toEqual(mockRoom);
        expect(db_1.db.insert).toHaveBeenCalledWith(schema_1.RoomTable);
    });
    // 404 if room is not found
    it('should return status 404 if room is not found', async () => {
        db_1.db.query.RoomTable.findFirst.mockResolvedValue(null);
        const result = await (0, room_service_1.getRoomByIdService)(999);
        expect(result).toBeNull();
        expect(db_1.db.query.RoomTable.findFirst).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.any(Function),
            columns: expect.any(Object),
        }));
    });
    // 200 if room is updated successfully
    it('should return status 200 if room is updated successfully', async () => {
        db_1.db.update.mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockRoom])
                })
            })
        });
        const result = await (0, room_service_1.updateRoomService)(1, mockRoom);
        expect(result).toEqual([mockRoom]);
        expect(db_1.db.update).toHaveBeenCalledWith(schema_1.RoomTable);
    });
    // 200 if room is deleted successfully
    it('should return status 200 if room is deleted successfully', async () => {
        db_1.db.delete.mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockRoom])
            })
        });
        const result = await (0, room_service_1.deleteRoomService)(1);
        expect(result).toEqual([mockRoom]);
        expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.RoomTable);
    });
    // 404 if room is not deleted
    // 200 if room is updated successfully
    it('should return status 200 if room is updated successfully', async () => {
        db_1.db.update.mockReturnValue({
            set: jest.fn().mockReturnValue({
                where: jest.fn().mockReturnValue({
                    returning: jest.fn().mockResolvedValue([mockRoom])
                })
            })
        });
        const result = await (0, room_service_1.updateRoomService)(1, mockRoom);
        expect(result).toEqual([mockRoom]);
        expect(db_1.db.update).toHaveBeenCalledWith(schema_1.RoomTable);
    });
    // 200 if room is deleted successfully
    it('should return status 200 if room is deleted successfully', async () => {
        db_1.db.delete.mockReturnValue({
            where: jest.fn().mockReturnValue({
                returning: jest.fn().mockResolvedValue([mockRoom])
            })
        });
        const result = await (0, room_service_1.deleteRoomService)(1);
        expect(result).toEqual([mockRoom]);
        expect(db_1.db.delete).toHaveBeenCalledWith(schema_1.RoomTable);
    });
    // 404 if room is not deleted
    // 500 if room creation fails
    it('should return status 500 if room creation fails', async () => {
        db_1.db.insert.mockReturnValue({
            values: jest.fn().mockReturnValue({
                returning: jest.fn().mockRejectedValue(new Error('Database error'))
            })
        });
        await expect((0, room_service_1.createRoomService)(mockRoom)).rejects.toThrow('Database error');
    });
});
