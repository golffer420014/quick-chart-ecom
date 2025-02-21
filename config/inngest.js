import { Inngest } from "inngest";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const inngest = new Inngest({ id: "quickcart-next" });

// inngest fnc to save user data to a database
export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        };

        await prisma.users.upsert({
            where: { id },
            update: userData,
            create: userData,
        });
    }
);


// inngest fnc to save cart data to a database
export const syncUserUpdation = inngest.createFunction(
    { id: "update-user-from-clerk" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data;

        const userData = {
            id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        };

        await prisma.users.upsert({
            where: { id },
            update: userData,
            create: userData,
        });
    }
);


// inngest fnc to delete user data from a database
export const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-from-clerk" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const { id } = event.data;
        await prisma.users.deleteMany({ where: { id } });
    }
);
