import { TIUser, UserTable } from "../../src/Drizzle/schema";
import { sql, eq } from "drizzle-orm";
import { db } from "../Drizzle/db";

export const createAuthService = async (userData: TIUser) => {
    try {
        const userFields: TIUser = {
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            password: userData.password,
        };

        // Basic field validation
        if (!userFields.first_name || !userFields.last_name || !userFields.email || !userFields.password) {
            throw new Error('Missing required user fields');
        }

        // Password validation
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(userFields.password)) {
            throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
        }

        // Check if user already exists with this email
        const existingUser = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, userFields.email)
        });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Insert user (without transaction)
        const result = await db.insert(UserTable).values(userFields).returning();

        let createdUser;
        console.log("Created user result:", result);
        if (Array.isArray(result)) {
            createdUser = result[0];
        } else {
            createdUser = result;
        }

        return createdUser;

    } catch (error) {
        console.error("Auth service error:", error);
        if (error instanceof Error) {
            if (error.message === 'Missing required user fields') {
                throw error;
            }
            if (
                error.message.includes('duplicate key value violates unique constraint') ||
                error.message.includes('unique constraint') ||
                error.message.includes('UNIQUE constraint failed') ||
                (error as any).code === '23505' ||
                (error.message.includes('email') && error.message.includes('already exists'))
            ) {
                throw new Error('Email already exists');
            }
        }
        throw new Error('Database error');
    }
};

export const loginAuthService = async (user: TIUser) => {
    const { email } = user;
    const result = await db.query.UserTable.findFirst({
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            role: true,
            is_verified: true
        },
        where: sql`${UserTable.email} = ${email}`
    });

    return result;
};

export const getAllUsersService = async (page?: number, limit?: number) => {
    try {
        const currentPage = page && page > 0 ? page : 1;
        const pageSize = limit && limit > 0 ? limit : 10;
        const offset = (currentPage - 1) * pageSize;

        const totalUsers = await db.query.UserTable.findMany({
            columns: {
                user_id: true
            }
        });
        const totalCount = totalUsers.length;
        const totalPages = Math.ceil(totalCount / pageSize);

        const allUsers = await db.query.UserTable.findMany({
            columns: {
                user_id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                is_verified: true,
                created_at: true,
                updated_at: true
            },
            limit: pageSize,
            offset: offset
        });

        return {
            users: allUsers,
            pagination: {
                currentPage,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPreviousPage: currentPage > 1
            }
        };
    } catch (error) {
        console.error("Error fetching all users:", error);
        throw new Error("Failed to fetch all users");
    }
};

export const updateVerificationStatus = async (email: string, isVerified: boolean) => {
    const [updatedUser] = await db.update(UserTable)
        .set({ is_verified: isVerified })
        .where(sql`${UserTable.email} = ${email}`)
        .returning();
    return updatedUser;
};

export const getUserByIdService = async (userId: number) => {
    const user = await db.query.UserTable.findFirst({
        where:  eq(UserTable.user_id, userId),
        columns: {
            user_id: true,
            first_name: true,
            last_name: true,
            email: true,
            password: true,
            role: true,
            is_verified: true,
            created_at: true,
            updated_at: true
        }
    });
    return user;
};

export const updateUserService = async (userId: number, user: Partial<TIUser>) => {
    const updatedUser = await db.update(UserTable)
        .set(user)
        .where(sql`${UserTable.user_id} = ${userId}`)
        .returning();

    if (!updatedUser) return null;
    if (Array.isArray(updatedUser)) {
        return updatedUser.length > 0 ? updatedUser[0] : null;
    }
    return updatedUser;
};

export const deleteUserService = async (userId: number) => {
    const deletedUser = await db.delete(UserTable)
        .where(sql`${UserTable.user_id} = ${userId}`)
        .returning();

    if (!deletedUser) return null;
    if (Array.isArray(deletedUser)) {
        return deletedUser.length > 0 ? deletedUser[0] : null;
    }
    return deletedUser;
};
