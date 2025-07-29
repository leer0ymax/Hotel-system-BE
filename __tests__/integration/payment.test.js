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
let paymentId;
const testUser = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    password: "password123",
    role: "user",
    is_verified: false
};
const testHotel = {
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St",
    contact_number: "1234567890",
    category: "Luxury",
    img_url: "http://example.com/hotel.jpg",
    description: "A luxurious hotel for testing purposes.",
    rating: 5,
};
const testRoom = {
    room_number: "101",
    room_type: "Deluxe",
    price_per_night: 200,
    capacity: 2,
    amenities: "WiFi, TV, Air Conditioning",
    img_url: "http://example.com/room.jpg",
    description: "A deluxe room for testing purposes.",
    availability: "available"
};
const testBooking = {
    check_in_date: "2023-10-01",
    check_out_date: "2023-10-05",
    total_amount: 800,
    status: "confirmed"
};
const testPayment = {
    amount: 800,
    payment_method: "credit_card",
    payment_status: "completed",
    transaction_id: "txn_1234567890",
};
beforeAll(async () => {
    const hashedPassword = await bcryptjs_1.default.hash(testUser.password, 10);
    const userResponse = await db_1.db.insert(schema_1.UserTable).values({
        ...testUser,
        password: hashedPassword
    }).returning();
    userId = userResponse[0].user_id;
    const hotelResponse = await db_1.db.insert(schema_1.HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
    const roomResponse = await db_1.db.insert(schema_1.RoomTable).values({
        ...testRoom,
        hotel_id: hotelId,
    }).returning();
    roomId = roomResponse[0].room_id;
    const testBookingResponse = await db_1.db.insert(schema_1.BookingTable).values({
        ...testBooking,
        user_id: userId,
        hotel_id: hotelId,
        room_id: roomId,
    }).returning();
    bookingId = testBookingResponse[0].booking_id;
    const paymentResponse = await db_1.db.insert(schema_1.PaymentTable).values({
        ...testPayment,
        booking_id: bookingId,
    }).returning();
    paymentId = paymentResponse[0].payment_id;
});
afterAll(async () => {
    await db_1.db.delete(schema_1.PaymentTable).where((0, drizzle_orm_1.eq)(schema_1.PaymentTable.payment_id, paymentId));
    await db_1.db.delete(schema_1.BookingTable).where((0, drizzle_orm_1.eq)(schema_1.BookingTable.booking_id, bookingId));
    await db_1.db.delete(schema_1.RoomTable).where((0, drizzle_orm_1.eq)(schema_1.RoomTable.room_id, roomId));
    await db_1.db.delete(schema_1.HotelTable).where((0, drizzle_orm_1.eq)(schema_1.HotelTable.hotel_id, hotelId));
    await db_1.db.delete(schema_1.UserTable).where((0, drizzle_orm_1.eq)(schema_1.UserTable.user_id, userId));
});
describe("Payment Integration Tests", () => {
    it("should create a payment", async () => {
        const newPayment = {
            ...testPayment,
            booking_id: bookingId,
            transaction_id: "txn_new_payment"
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/payments")
            .send(newPayment)
            .expect(201);
        expect(response.body).toHaveProperty("payment_id");
        expect(response.body).toHaveProperty("booking_id", bookingId);
        expect(response.body).toHaveProperty("amount", newPayment.amount);
        expect(response.body).toHaveProperty("payment_method", newPayment.payment_method);
        expect(response.body).toHaveProperty("payment_status", newPayment.payment_status);
    });
    it("should get all payments", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get("/payments")
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("payment_id");
        expect(response.body[0]).toHaveProperty("booking_id");
        expect(response.body[0]).toHaveProperty("amount");
        expect(response.body[0]).toHaveProperty("payment_method");
        expect(response.body[0]).toHaveProperty("payment_status");
    });
    it("should get a payment by ID", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get(`/payments/${paymentId}`)
            .expect(200);
        expect(response.body).toHaveProperty("payment_id", paymentId);
        expect(response.body).toHaveProperty("booking_id", bookingId);
        expect(response.body).toHaveProperty("amount", testPayment.amount);
        expect(response.body).toHaveProperty("payment_method", testPayment.payment_method);
        expect(response.body).toHaveProperty("payment_status", testPayment.payment_status);
    });
    it("should update a payment", async () => {
        const updatedPayment = {
            ...testPayment,
            amount: 900,
            payment_status: "refunded",
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .put(`/payments/${paymentId}`)
            .send(updatedPayment)
            .expect(200);
        expect(response.body).toHaveProperty("payment_id", paymentId);
        expect(response.body).toHaveProperty("amount", updatedPayment.amount);
        expect(response.body).toHaveProperty("payment_status", updatedPayment.payment_status);
    });
    it("should return 404 for non-existent payment", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get("/payments/999999")
            .expect(404);
        expect(response.body).toHaveProperty("message");
    });
    it("should return 400 for invalid payment data", async () => {
        const invalidPayment = {
            booking_id: "invalid",
            amount: "not-a-number",
            payment_method: "",
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/payments")
            .send(invalidPayment)
            .expect(400);
        expect(response.body).toHaveProperty("message");
    });
    it("should delete a payment", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .delete(`/payments/${paymentId}`)
            .expect(200);
        expect(response.body).toHaveProperty("message", "Payment deleted successfully");
        // Verify payment is deleted
        const checkResponse = await (0, supertest_1.default)(index_1.app)
            .get(`/payments/${paymentId}`)
            .expect(404);
        expect(checkResponse.body).toHaveProperty("message");
    });
});
