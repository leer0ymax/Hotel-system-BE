
import { db } from "./db";
import {
    UserTable,
    HotelTable,
    RoomTable,
    BookingTable,
    PaymentTable,
    CustomerSupportTable
} from "./schema";

async function seed() {
    console.log('Seeding database...');

    await db.insert(UserTable).values([
        {
            first_name: "A",
            last_name: "B",
            email: "ab@example.com",
            password: "hashedpassword1",
            role: "user",
            is_verified: false,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: "C",
            last_name: "D",
            email: "cd@gmail.com",
            password: "hashedpassword2",
            role: "user",
            is_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: "E",
            last_name: "F",
            email: "ef@example.com",
            password: "hashedpassword3",
            role: "user",
            is_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: "G",
            last_name: "H",
            email: "gh@example.com",
            password: "hashedpassword4",
            role: "admin",
            is_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
        },
        
        {
            first_name: "I",
            last_name: "J",
            email: "ij@example.com",
            password: "hashedpassword4",
            role: "admin",
            is_verified: true,
            created_at: new Date(),
            updated_at: new Date(),
        },

]);

    await db.insert(HotelTable).values([
        {
            name: "Maili Saba",
            location: "Mombasa Beach",
            address: "123 Ocean Drive, Mombasa",
            contact_number: "+254700000001",
            category: "Resort",
            rating: 5,
            img_url: "https://example.com/hotel1.jpg",
            description: "A luxurious beachfront resort with stunning ocean views.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: "Mt. View Lodge",
            location: "Mt. Kenya",
            address: "456 Summit Road, Nanyuki",
            contact_number: "+254700000002",
            category: "Lodge",
           img_url: "https://example.com/hotel2.jpg",
            description: "A cozy lodge nestled in the mountains with breathtaking views.",
            rating: 4,
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: " Cabannas",
            location: "Nairobi CBD",
            address: "789 Kenyatta Avenue, Nairobi",
            contact_number: "+254700000003",
            category: "Hotel",
            rating: 3,
            img_url: "https://example.com/hotel3.jpg",
            description: "A modern hotel in the heart of the city, perfect for business travelers.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            name: " Serena Camp",
            location: "Maasai Mara",
            address: "101 Savanna Road, Narok",
            contact_number: "+254700000004",
            category: "Camp",
            rating: 5,
            img_url: "https://example.com/hotel4.jpg",
            description: "An adventurous camp offering safari experiences in the Maasai Mara.",
            created_at: new Date(),
            updated_at: new Date(),
        },
       
        {
            name: "Kunste Inn",
            location: "Nyeri",
            address: "707 Hill Road, Nyeri",
            contact_number: "+254700000010",
            category: "Hotel",
            rating: 3,
            img_url: "https://example.com/hotel9.jpg",
            description: "A charming inn in the highlands, offering a peaceful retreat.",
            created_at: new Date(),
            updated_at: new Date(),
        }
    ]).returning();

    await db.insert(RoomTable).values([
        {
            hotel_id: 1,
            room_number: "1",
            room_type: "Deluxe",
            price_per_night: 12000,
            capacity: 2,
            amenities: "WiFi,TV,AC",
            availability: "available",
           img_url: "https://example.com/room1.jpg",
            description: "A spacious deluxe room with ocean views and modern amenities.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            hotel_id: 1,
            room_number: "2",
            room_type: "Standard",
            price_per_night: 8000,
            capacity: 2,
            amenities: "WiFi,TV",
            availability: "available",
            img_url: "https://example.com/room2.jpg",
            description: "A comfortable standard room with all basic amenities.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            hotel_id: 2,
            room_number: "2",
            room_type: "Suite",
            price_per_night: 20000,
            capacity: 4,
            amenities: "WiFi,TV,AC,Mini Bar",
            availability: "available",
           img_url: "https://example.com/room3.jpg",  
            description: "A luxurious suite with a separate living area and stunning mountain views.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            hotel_id: 3,
            room_number: "3",
            room_type: "Single",
            price_per_night: 6000,
            capacity: 1,
            amenities: "WiFi,TV",
            availability: "booked",
            img_url: "https://example.com/room4.jpg", 
            description: "A cozy single room, perfect for solo travelers.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            hotel_id: 4,
            room_number: "4",
            room_type: "Tent",
            price_per_night: 15000,
            capacity: 2,
            amenities: "WiFi,Outdoor Shower",
            availability: "available",
            img_url: "https://example.com/room5.jpg",
            description: "A unique tent experience with luxury amenities in the heart of the savanna.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            hotel_id: 5,
            room_number: "5",
            room_type: "Deluxe",
            price_per_night: 14000,
            capacity: 3,
            amenities: "WiFi,TV,AC,Balcony",
            availability: "available",
           img_url: "https://example.com/room6.jpg",
            description: "A deluxe room with a private balcony overlooking the beach.",
            created_at: new Date(),
            updated_at: new Date(),
        },
        
    ]).returning();

  
    await db.insert(BookingTable).values([ 

        {
            user_id: 1,
            hotel_id: 1,
            room_id: 1,
            check_in_date: '2023-10-01',
            check_out_date: '2023-10-03',
            total_amount: 24000, // 2 nights * 12000
            status: "confirmed",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 2,
            hotel_id: 2,
            room_id: 3,
            check_in_date: '2023-10-02',
            check_out_date: '2023-10-05',
            total_amount: 60000, // 3 nights * 20000
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 3,
            hotel_id: 3,
            room_id: 4,
            check_in_date: '2023-10-03',
            check_out_date: '2023-10-04',
            total_amount: 6000, // 1 night * 6000
            status: "confirmed",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 4,
            hotel_id: 4,
            room_id: 5,
            check_in_date: '2023-10-04',
            check_out_date: '2023-10-06',
            total_amount: 30000, // 2 nights * 15000
            status: "confirmed",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 5,
            hotel_id: 5,
            room_id: 6,
            check_in_date: '2023-10-05',
            check_out_date: '2023-10-08',
            total_amount: 42000, // 3 nights * 14000
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        },
        ]);

    await db.insert(PaymentTable).values([
        {
            booking_id: 1,
            amount: 24000,
            payment_method: "MOMO",
            payment_status: "completed",
            transaction_id: "TXN123456",
            payment_date: new Date(),
        },
        {
            booking_id: 2,
            amount: 60000,
            payment_method: "Debit Card",
            payment_status: "pending",
            transaction_id: "TXN654321",
            payment_date: new Date(),
        },
        {
            booking_id: 3,
            amount: 6000,
            payment_method: "Debit Card",
            payment_status: "completed",
            transaction_id: "TXN789123",
            payment_date: new Date(),
        },
        {
            booking_id: 4,
            amount: 30000,
            payment_method: "Mpesa",
            payment_status: "completed",
            transaction_id: "TXN456789",
            payment_date: new Date(),
        },
        {
            booking_id: 5,
            amount: 42000,
            payment_method: "Credit Card",
            payment_status: "pending",
            transaction_id: "TXN987123",
            payment_date: new Date(),
        },
        
    ]);

    await db.insert(CustomerSupportTable).values([
        {
            user_id: 1,
            subject: " Room Booking Issue",
            description: " Unable to book room 1",
            status: "open",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 2,
            subject: " Defective AC",
            description: " AC not cooling in room 2",
            status: "closed",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 3,
            subject: "Room Service",
            description: " Need extra towels in room 3",
            status: "open",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 4,
            subject: "Report Tv malfunction",
            description: " TV is not working in room 4",
            status: "pending",
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_id: 5,
            subject: " Request for bathroom help",
            description: "Requesting toiletries for room 5.",
            status: "closed",
            created_at: new Date(),
            updated_at: new Date(),
        },
        
    ]);

    console.log('Database seeded successfully.');
}

seed()
    .then(() => {
        console.log('Seeding process completed.');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Error seeding database:', error);
        process.exit(1);
    });
