"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../../src/Drizzle/schema");
const index_1 = require("../../src/index");
const supertest_1 = __importDefault(require("supertest"));
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../src/Drizzle/db");
let hotelId;
const testHotel = {
    name: "Test Hotel",
    location: "Test Location",
    address: "123 Test St, Test City, TC 12345",
    contact_number: "1234567890",
    category: "Luxury",
    rating: 5,
    img_url: "https://example.com/test-hotel.jpg",
    description: "A test hotel for integration testing."
};
beforeAll(async () => {
    // Create test hotel
    const hotelResponse = await db_1.db.insert(schema_1.HotelTable).values({
        ...testHotel,
    }).returning();
    hotelId = hotelResponse[0].hotel_id;
});
afterAll(async () => {
    // Clean up test data
    await db_1.db.delete(schema_1.HotelTable).where((0, drizzle_orm_1.eq)(schema_1.HotelTable.hotel_id, hotelId));
});
describe("Hotel Integration Tests", () => {
    it("should create a new hotel", async () => {
        const newHotel = {
            ...testHotel,
            name: "New Test Hotel",
            contact_number: "0987654321"
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/hotels")
            .send(newHotel)
            .expect(201);
        expect(response.body).toHaveProperty("hotel_id");
        expect(response.body).toHaveProperty("name", newHotel.name);
        expect(response.body).toHaveProperty("location", newHotel.location);
        expect(response.body).toHaveProperty("address", newHotel.address);
        expect(response.body).toHaveProperty("contact_number", newHotel.contact_number);
        expect(response.body).toHaveProperty("category", newHotel.category);
        expect(response.body).toHaveProperty("rating", newHotel.rating);
        // Clean up the created hotel
        await db_1.db.delete(schema_1.HotelTable).where((0, drizzle_orm_1.eq)(schema_1.HotelTable.hotel_id, response.body.hotel_id));
    });
    it("should get all hotels", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get("/hotels")
            .expect(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty("hotel_id");
        expect(response.body[0]).toHaveProperty("name");
        expect(response.body[0]).toHaveProperty("location");
        expect(response.body[0]).toHaveProperty("address");
        expect(response.body[0]).toHaveProperty("contact_number");
        expect(response.body[0]).toHaveProperty("category");
        expect(response.body[0]).toHaveProperty("rating");
    });
    it("should get a hotel by ID", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get(`/hotels/${hotelId}`)
            .expect(200);
        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("name", testHotel.name);
        expect(response.body).toHaveProperty("location", testHotel.location);
        expect(response.body).toHaveProperty("address", testHotel.address);
        expect(response.body).toHaveProperty("contact_number", testHotel.contact_number);
        expect(response.body).toHaveProperty("category", testHotel.category);
        expect(response.body).toHaveProperty("rating", testHotel.rating);
    });
    it("should update a hotel", async () => {
        const updatedHotel = {
            ...testHotel,
            name: "Updated Test Hotel",
            rating: 4
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .put(`/hotels/${hotelId}`)
            .send(updatedHotel)
            .expect(200);
        expect(response.body).toHaveProperty("hotel_id", hotelId);
        expect(response.body).toHaveProperty("name", updatedHotel.name);
        expect(response.body).toHaveProperty("rating", updatedHotel.rating);
    });
    it("should return 404 for non-existent hotel", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .get("/hotels/999999")
            .expect(404);
        expect(response.body).toHaveProperty("message", "Hotel not found");
    });
    it("should return 400 for invalid hotel data", async () => {
        const invalidHotel = {
            name: "",
            location: "",
            rating: "not-a-number"
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/hotels")
            .send(invalidHotel)
            .expect(400);
        expect(response.body).toHaveProperty("message");
    });
    it("should return 400 for missing required fields", async () => {
        const incompleteHotel = {
            name: "Incomplete Hotel"
            // Missing other required fields
        };
        const response = await (0, supertest_1.default)(index_1.app)
            .post("/hotels")
            .send(incompleteHotel)
            .expect(400);
        expect(response.body).toHaveProperty("message");
    });
    it("should delete a hotel", async () => {
        // Create a hotel specifically for deletion
        const hotelToDelete = await db_1.db.insert(schema_1.HotelTable).values({
            ...testHotel,
            name: "Hotel to Delete"
        }).returning();
        const response = await (0, supertest_1.default)(index_1.app)
            .delete(`/hotels/${hotelToDelete[0].hotel_id}`)
            .expect(200);
        expect(response.body).toHaveProperty("message", "Hotel deleted successfully");
        // Verify hotel is deleted
        const checkResponse = await (0, supertest_1.default)(index_1.app)
            .get(`/hotels/${hotelToDelete[0].hotel_id}`)
            .expect(404);
        expect(checkResponse.body).toHaveProperty("message", "Hotel not found");
    });
    it("should return 404 when deleting non-existent hotel", async () => {
        const response = await (0, supertest_1.default)(index_1.app)
            .delete("/hotels/999999")
            .expect(404);
        expect(response.body).toHaveProperty("message", "Hotel not found");
    });
});
