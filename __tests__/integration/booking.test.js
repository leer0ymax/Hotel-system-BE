"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../src/Drizzle/schema");
const index_1 = require("../../src/index");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const supertest_1 = __importDefault(require("supertest"));
const db_1 = require("../../src/Drizzle/db");
let userId;
let hotelId;
let roomId;
let bookingId;
let testUser = {
    first_name: "Test",
    last_name: "User",
    email: "testUser@gmail.com",
    password: "testPassword123",
    role: "user",
    is_verified: false
};
let testHotel = {
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5,
    img_url: "https://example.com/test-hotel.jpg",
    description: "A test hotel for integration testing."
};
let testRoom = {
    room_number: "101",
    room_type: "Deluxe",
    price_per_night: 200,
    capacity: 2,
    amenities: "WiFi, TV, Air Conditioning",
    img_url: "https://example.com/test-room.jpg",
    description: "A test room for integration testing.",
    availability: "available"
};
let testBooking = {
    check_in_date: new Date("2023-10-01"),
    check_out_date: new Date("2023-10-05"),
    total_amount: 800,
    status: "confirmed"
};
beforeAll(async () => {
    const hashedPassword = await bcryptjs_1.default.hashSync(testUser.password, 10);
    const userResponse = await db_1.db.insert(schema_1.UserTable).values({
        ...testUser,
        password: hashedPassword
    }).returning();
    userId = userResponse[0].user_id;
    // Insert hotel into the correct HotelTable (replace 'HotelTable' with your actual hotel table import)
    const hotelResponse = await db_1.db.insert(schema_1.HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
    const roomResponse = await db_1.db.insert(schema_1.RoomTable).values({
        ...testRoom,
        hotel_id: hotelId,
    }).returning();
    roomId = roomResponse[0].room_id;
    const bookingResponse = await db_1.db.insert(schema_1.BookingTable).values({
        ...testBooking,
        check_in_date: testBooking.check_in_date.toISOString(),
        check_out_date: testBooking.check_out_date.toISOString(),
        user_id: userId,
        hotel_id: hotelId,
        room_id: roomId
    }).returning();
    bookingId = bookingResponse[0].booking_id;
});
afterAll(async () => {
    await db_1.db.delete(schema_1.BookingTable).where((0, drizzle_orm_1.eq)(schema_1.BookingTable.booking_id, bookingId));
    await db_1.db.delete(schema_1.RoomTable).where((0, drizzle_orm_1.eq)(schema_1.RoomTable.room_id, roomId));
    await db_1.db.delete(schema_1.HotelTable).where((0, drizzle_orm_1.eq)(schema_1.HotelTable.hotel_id, hotelId));
    await db_1.db.delete(schema_1.UserTable).where((0, drizzle_orm_1.eq)(schema_1.UserTable.user_id, userId));
});
describe("Booking Integration Tests", () => {
    it("should create a booking", async () => {
        try {
            const newBooking = {
                user_id: userId,
                hotel_id: hotelId,
                room_id: roomId,
                check_in_date: new Date("2023-10-10"),
                check_out_date: new Date("2023-10-15"),
                total_amount: 1000,
                status: "confirmed"
            };
            const res = await (0, supertest_1.default)(index_1.app)
                .post("/bookings")
                .send(newBooking);
            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty("booking_id");
        }
        catch (error) {
            console.error("Error creating booking:", error);
            throw error;
        }
    });
    it("should get all bookings", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .get("/bookings")
            .query({ user_id: userId });
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty("booking_id");
        expect(res.body[0]).toHaveProperty("user_id", userId);
        expect(res.body[0]).toHaveProperty("hotel_id", hotelId);
        expect(res.body[0]).toHaveProperty("room_id", roomId);
        expect(res.body[0]).toHaveProperty("check_in_date");
        expect(res.body[0]).toHaveProperty("check_out_date");
        expect(res.body[0]).toHaveProperty("total_amount");
        expect(res.body[0]).toHaveProperty("status");
    });
    it("should get a booking by ID", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .get(`/bookings/${bookingId}`)
            .query({ user_id: userId });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("booking_id", bookingId);
        expect(res.body).toHaveProperty("user_id", userId);
        expect(res.body).toHaveProperty("hotel_id", hotelId);
        expect(res.body).toHaveProperty("room_id", roomId);
        expect(res.body).toHaveProperty("check_in_date");
        expect(res.body).toHaveProperty("check_out_date");
        expect(res.body).toHaveProperty("total_amount");
        expect(res.body).toHaveProperty("status");
    });
    it("should update a booking", async () => {
        const updatedBooking = {
            check_in_date: new Date("2023-10-12"),
            check_out_date: new Date("2023-10-16"),
            total_amount: 1200,
            status: "confirmed"
        };
        const res = await (0, supertest_1.default)(index_1.app)
            .put(`/bookings/${bookingId}`)
            .send(updatedBooking);
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("booking_id", bookingId);
        expect(res.body).toHaveProperty("user_id", userId);
    });
    it("should return 404 for non-existent booking", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .get(`/bookings/999999`)
            .query({ user_id: userId });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Booking not found");
    });
    it("should return 400 for invalid booking data", async () => {
        const invalidBooking = {
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            check_in_date: "invalid-date",
            check_out_date: "invalid-date",
            total_amount: "invalid-amount",
            status: "confirmed"
        };
        const res = await (0, supertest_1.default)(index_1.app)
            .post("/bookings")
            .send(invalidBooking);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Invalid booking data");
    });
    it("should return 403 for unauthorized access", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .get(`/bookings/999999`)
            .set("Authorization", "Bearer invalid_token");
        expect(res.status).toBe(403);
        expect(res.body).toHaveProperty("message", "Unauthorized access");
    });
    it("should return 500 for server error", async () => {
        // Simulate a server error by passing invalid data
        const res = await (0, supertest_1.default)(index_1.app)
            .post("/bookings")
            .send({}); // Sending empty data to trigger an error
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Missing required fields");
    });
    it("should return 400 for missing required fields", async () => {
        const incompleteBooking = {
            user_id: userId,
            hotel_id: hotelId,
            room_id: roomId,
            // Missing check_in_date and check_out_date
            total_amount: 500,
            status: "confirmed"
        };
        const res = await (0, supertest_1.default)(index_1.app)
            .post("/bookings")
            .send(incompleteBooking);
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty("message", "Missing required fields");
    });
    it("should handle booking cancellation", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .delete(`/bookings/${bookingId}`)
            .query({ user_id: userId });
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("message", "Booking deleted successfully");
    });
    it("should return 404 for deleted booking", async () => {
        const res = await (0, supertest_1.default)(index_1.app)
            .get(`/bookings/${bookingId}`)
            .query({ user_id: userId });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty("message", "Booking not found");
    });
});
