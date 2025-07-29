import { CustomerSupportTable, TICustomerSupport } from "../../src/Drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "../Drizzle/db";



export const createNewComplainsService = async (complains:TICustomerSupport) => {
 const newComplains = await db.insert(CustomerSupportTable).values(complains).returning();
    
 return newComplains;

    
    
}

export const getAllComplainsService = async () => {
    const allComplains = await db.query.CustomerSupportTable.findMany({
        columns:{
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,

        }
    })
    return allComplains;
}

export const getComplainsByIdService = async (ticketId: number) => {
    const complain = await db.query.CustomerSupportTable.findFirst({
        where: eq(CustomerSupportTable.ticket_id, ticketId),
        columns: {
            ticket_id: true,
            user_id: true,
            subject: true,
            description: true,
            status: true,
            created_at: true,
            updated_at: true,
        }
    });
    return complain;
}

export const updateComplainsService = async (ticketId: number, updates: Partial<TICustomerSupport>) => {
    const updatedComplain = await db.update(CustomerSupportTable)
        .set(updates)
        .where(sql`${CustomerSupportTable.ticket_id} = ${ticketId}`)
        .returning();
    
    return updatedComplain;
}
export const deleteComplainsService = async (ticketId: number) => {
    const deletedComplain = await db.delete(CustomerSupportTable)
        .where(sql`${CustomerSupportTable.ticket_id} = ${ticketId}`)
        .returning();
    
    return deletedComplain;
}